import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Callback URL, Google redirects with the authorization code
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      console.error("Authorization code missing");
      return NextResponse.json({ error: "Authorization code missing", success: false });
    }

    //creates a oauth2client object
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/auth/gmail/callback`
    );

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email || !session.user?.id) {
      console.error("Unauthorized session:", session);
      return NextResponse.json({ error: "Unauthorized", success: false });
    }

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token || !tokens.token_type || !tokens.expiry_date || !tokens.id_token) {
      console.error("Missing required token fields:", tokens);
      return NextResponse.json({ error: "Missing required token fields" }, { status: 400 });
    }

    //configuring the oauth2client with credentials
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    });

    //to get the email of the user
    const people = google.people({ version: "v1", auth: oauth2Client });
    const me = await people.people.get({
      resourceName: "people/me",
      personFields: "emailAddresses"
    });

    const userEmail = me.data.emailAddresses?.[0]?.value || session.user.email;

    await prisma.gmailConnection.upsert({
      where: { userId: session.user.id },
      update: {
        gmail: userEmail,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenType: tokens.token_type,
        id_token: tokens.id_token,
        tokenExpiry: tokens.expiry_date,
      },
      create: {
        userId: session.user.id,
        gmail: userEmail,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenType: tokens.token_type,
        id_token: tokens.id_token,
        tokenExpiry: tokens.expiry_date,
      }
    });

    return NextResponse.redirect("http://localhost:3000/workflow/slfkjsf/sdflsjdf");
  } catch (error) {
    console.log("Failed to exchange code for tokens:", error);
    return NextResponse.json({ error: "Failed to exchange code for tokens", details: error }, { status: 500 });
  }
}