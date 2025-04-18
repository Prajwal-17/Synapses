export const handleGoogleLogin = () => {
  const clientId = process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/auth/google/callback`;
  const scope =
    "https://mail.google.com/ https://www.googleapis.com/auth/user.emails.read https://www.googleapis.com/auth/userinfo.profile";

  // Use 'state' to indicate it's a popup flow
  const state = encodeURIComponent(JSON.stringify({ popup: true }));

  //
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&prompt=consent&state=${state}`;

  //to open a popup window
  window.open(googleAuthUrl, "Google OAuth", "height=600,width=800");
};

export const handleNotionLogin = () => {

  const NEXT_PUBLIC_NOTION_AUTHORIZATION_URL = process.env.NEXT_PUBLIC_NOTION_AUTHORIZATION_URL;
  const state = encodeURIComponent(JSON.stringify({ popup: true }))

  const notionAuthUrl = `${NEXT_PUBLIC_NOTION_AUTHORIZATION_URL}&state=${state}`

  window.open(notionAuthUrl, "Notion OAuth", "height=600,width=800")
};
