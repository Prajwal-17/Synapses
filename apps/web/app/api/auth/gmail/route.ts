import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    //ref -> https://www.npmjs.com/package/googleapis#oauth2-client
    //creates a oauth2client object
    const oauth2client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/auth/gmail/callback`
    );

    //requsting urls for access to google
    const scopes = [
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/userinfo.email",
      "profile",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    /** generate authorization url 
     *  "offline" - to get refersh token for offline access
     * "consent" - user consent screen
     */
    const url = oauth2client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
    });

    // return NextResponse.json({ url })
    return NextResponse.redirect(url)
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 });

  }
}
