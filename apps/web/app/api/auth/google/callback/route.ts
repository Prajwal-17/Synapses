import { google } from 'googleapis';
import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@repo/db/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code'); //authorization code sent by google
  const state = searchParams.get('state');//state of the popup window

  // Check if we're in a popup flow -> {"popup":true}
  // encode & decodeURIComponent -> to endcode & decode the uri query params eg(escape sequences)
  const isPopup = state ? JSON.parse(decodeURIComponent(state)).popup : false;

  if (!code) {
    return NextResponse.json({ msg: "Code not present" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email || !session.user?.id) {
      console.error("Unauthorized session:", session);
      return NextResponse.json({ error: "Unauthorized", success: false });
    }

    //create an instance of google oauth2 to handle token exchange
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID as string,
      process.env.GMAIL_CLIENT_SECRET as string,
      `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
    );

    const tokenResponse = await oauth2Client.getToken(code);
    const tokens = tokenResponse.tokens;

    const refreshToken = tokens.refresh_token as string;
    const accessToken = tokens.access_token;

    if (!accessToken || !tokens.token_type || !tokens.expiry_date || !tokens.id_token) {
      console.log("Missing required token fields:", tokens);
      return NextResponse.json({ error: "Missing required token fields" }, { status: 400 });
    }

    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    });

    const service = google.people({ version: "v1", auth: oauth2Client });
    const me = await service.people.get({
      resourceName: "people/me",
      personFields: "emailAddresses",
    });

    const googleProfile = me.data;
    const googleEmail = googleProfile.emailAddresses?.[0]?.value;

    if (!googleEmail) {
      return NextResponse.json({ msg: "not email" })
    }

    const existingConnection = await prisma.connection.findFirst({
      where: {
        userId: session.user.id,
        appType: "Gmail",
        metaData: {
          path: ["email"],
          equals: googleEmail,
        },
      },
    });

    if (existingConnection) {
      await prisma.connection.update({
        where: {
          id: existingConnection.id,
        },
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          metaData: {
            email: googleEmail,
            tokenType: tokenResponse.tokens.token_type as string,
            id_token: tokenResponse.tokens.id_token as string,
          },
          expiresAt: new Date(tokenResponse.tokens.expiry_date as number),
        },
      });
    } else {
      await prisma.connection.create({
        data: {
          userId: session.user.id,
          appType: "Gmail",
          accessToken: accessToken,
          refreshToken: refreshToken,
          metaData: {
            email: googleEmail,
            tokenType: tokenResponse.tokens.token_type as string,
            id_token: tokenResponse.tokens.id_token as string,
          },
          expiresAt: new Date(tokenResponse.tokens.expiry_date as number),
        },
      });
    }

    /**
     * if popup is open then we are sending a html page which sends a success message and closes the popup window
     * window.opener -> the parent window which opened the popup window 
     * "*" -> message to be sent to any origin
     * window.onload -> js event handler to check the if page fully loaded  
     */
    if (isPopup) {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Successful</title>
            <script>
              window.onload = function() {
                if (window.opener) {
                  window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
                  window.close();
                }
              };
            </script>
          </head>
          <body>
            <p>Authentication successful! You can close this window.</p>
          </body>
        </html>
      `;

      //serialize is used for formatting cookies so that it can be included & sent in the http header eg(bytes format)
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Set-Cookie': serialize('refreshToken', refreshToken, {
            httpOnly: true,// Prevents client-side JavaScript from accessing the cookie (security measure)
            path: '/',// Cookie is available across the entire site
            secure: process.env.NODE_ENV === 'production',// Ensures the cookie is only sent over HTTPS in production
            sameSite: 'strict',// Prevents the cookie from being sent with cross-site requests (protects against CSRF attacks)
          })
        }
      });
    }
  } catch (error) {
    console.error('Google OAuth Token Exchange Error:', error);
    return NextResponse.json({ msg: "Google OAuth Token Exchange Error" });
  }
}