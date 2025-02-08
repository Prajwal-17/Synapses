import { google } from 'googleapis';
import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code'); //authorization code sent by google

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
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
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

    if (!refreshToken) {
      return NextResponse.json({ msg: "You have already added this gmail" })
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

    await prisma.gmailConnection.upsert({
      where: {
        gmail: googleEmail,
      },
      create: {
        userId: session?.user.id,
        gmail: googleEmail,
        accessToken,
        refreshToken,
        tokenType: tokens.token_type,
        id_token: tokens.id_token,
        tokenExpiry: tokens.expiry_date,
      },
      update: {
        userId: session?.user.id,
        gmail: googleEmail,
        accessToken,
        refreshToken,
        tokenType: tokens.token_type,
        id_token: tokens.id_token,
        tokenExpiry: tokens.expiry_date,
      }
    })

    const response = NextResponse.redirect("http://localhost:3000/home");

    //serialize is used for formatting cookies so that it can be included in the http header
    response.headers.set('Set-Cookie', serialize('refreshToken', refreshToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie (security measure)
      path: '/',// Cookie is available across the entire site
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
      sameSite: 'strict', // Prevents the cookie from being sent with cross-site requests (protects against CSRF attacks)
    }));

    return response;

  } catch (error: any) {
    console.error('Google OAuth Token Exchange Error:', error);
    return NextResponse.json({ msg: "Google OAuth Token Exchange Error" });
  }
}