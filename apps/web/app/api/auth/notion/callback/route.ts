import { authOptions } from "@/lib/authOptions";
import { prisma } from "@repo/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.json({ msg: "Code not present" }, { status: 400 });
  }
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email || !session.user?.id) {
      console.error("Unauthorized session:", session);
      return NextResponse.json({ error: "Unauthorized", success: false });
    }

    const NOTION_OAUTH_CLIENT_ID = process.env.NOTION_OAUTH_CLIENT_ID;
    const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
    const redirectUri = process.env.NOTION_REDIRECT_URI;

    const isPopup = state ? JSON.parse(decodeURIComponent(state)).popup : false;

    //encode to base64
    const encoded = Buffer.from(`${NOTION_OAUTH_CLIENT_ID}:${NOTION_CLIENT_SECRET}`).toString("base64");

    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ msg: "Auth token error" }, { status: 400 })
    }

    const existingConnection = await prisma.connection.findFirst({
      where: {
        userId: session.user.id,
        appType: "Notion",
        metaData: {
          path: ["workspace_id"],
          equals: data.workspace_id,
        },
      },
    });

    if (existingConnection) {
      await prisma.connection.update({
        where: {
          id: existingConnection.id,
        },
        data: {
          appType: "Notion",
          accessToken: data.access_token,
          refreshToken: "",
          metaData: {
            workspace_id: data.workspace_id,
            workspace_name: data.workspace_name,
            token_type: data.token_type,
            name: data.owner.name,
            request_id: data.request_id,
          },
          expiresAt: null,
        },
      });
    } else {
      await prisma.connection.create({
        data: {
          userId: session.user.id,
          appType: "Notion",
          accessToken: data.access_token,
          refreshToken: "",
          metaData: {
            workspace_id: data.workspace_id,
            workspace_name: data.workspace_name,
            token_type: data.token_type,
            name: data.owner.name,
            request_id: data.request_id,
          },
          expiresAt: null,
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
                  window.opener.postMessage({ type: 'NOTION_AUTH_SUCCESS' }, '*');
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
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}