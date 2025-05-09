import { authOptions } from "@/lib/authOptions";
import { prisma } from "@repo/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get("state")

  try {
    const isPopup = state ? JSON.parse(decodeURIComponent(state)).popup : false;

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email || !session.user?.id) {
      console.error("Unauthorized session:", session);
      return NextResponse.json({ error: "Unauthorized", success: false });
    }

    const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
    const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

    if (!code) {
      return NextResponse.json({ msg: "Code not present" }, { status: 400 });
    }

    // Use URLSearchParams to encode the body, don't use object or json
    const bodyParams = new URLSearchParams();
    bodyParams.append('grant_type', 'authorization_code');
    bodyParams.append('code', code);
    bodyParams.append('redirect_uri', REDIRECT_URI as string);

    // Send credentials in encoded form
    const encodedHeader = Buffer.from(`${DISCORD_CLIENT_ID}:${DISCORD_CLIENT_SECRET}`).toString("base64");

    const response = await fetch(`https://discord.com/api/v10/oauth2/token`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedHeader}`,
      },
      body: bodyParams,
    });

    const data = await response.json();

    if (data.error) {
      console.error('Discord OAuth error:', data.error);
      return NextResponse.json({ error: "Discord OAuth failed", success: false }, { status: 400 });
    }

    const discordUserResponse = await fetch('https://discord.com/api/v10/users/@me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
      },
    });

    if (!discordUserResponse.ok) {
      // throw new Error('Failed to fetch user data from Discord');
      return NextResponse.json({ error: "Discord OAuth failed", success: false }, { status: 400 });

    }

    const discordUserData = await discordUserResponse.json();
    const discordId = discordUserData.id;

    const existingConnection = await prisma.connection.findFirst({
      where: {
        userId: session.user.id,
        appType: 'Discord',
        metaData: {
          path: ['discordId'],
          equals: discordId,
        },
      },
    });

    if (existingConnection) {
      await prisma.connection.update({
        where: {
          id: existingConnection.id,
        },
        data: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          metaData: {
            discordId: discordId,
          },
          expiresAt: new Date(Date.now() + data.expires_in * 1000),
        },
      });
    } else {
      await prisma.connection.create({
        data: {
          userId: session.user.id,
          appType: 'Discord',
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          metaData: {
            discordId: discordId,
          },
          expiresAt: new Date(Date.now() + data.expires_in * 1000),
        },
      });
    }
    if (isPopup) {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Successful</title>
            <script>
              window.onload = function() {
                if (window.opener) {
                  window.opener.postMessage({ type: 'DISCORD_AUTH_SUCCESS' }, '*');
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

      return new NextResponse(html, {
        headers: {
          'Content-type': "text/html"
        }
      })
    }
  } catch (error) {
    console.error('Error during Discord connection flow:', error);
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 });
  }
}