export const handleGoogleLogin = () => {
  const clientId = process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/auth/google/callback`;
  const scope =
    "https://mail.google.com/ https://www.googleapis.com/auth/user.emails.read https://www.googleapis.com/auth/userinfo.profile";

  // Use 'state' to indicate it's a popup flow
  const state = encodeURIComponent(JSON.stringify({ popup: true }));

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&prompt=consent&state=${state}`;

  //to open a popup window
  window.open(googleAuthUrl, "Google OAuth", "height=600,width=800");
};

export const handleNotionLogin = () => {
  const NOTION_OAUTH_CLIENT_ID = process.env.NOTION_OAUTH_CLIENT_ID;
  const state = encodeURIComponent(JSON.stringify({ popup: true }))
  const redirectUri = `${window.location.origin}/api/auth/notion/callback`

  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${NOTION_OAUTH_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${redirectUri}&state=${state}`

  window.open(notionAuthUrl, "Notion OAuth", "height=600,width=800")
};

export const handleDiscordLogin = () => {
  const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const state = encodeURIComponent(JSON.stringify({ popup: true }))
  const scope = 'identify+email'

  const redirect_uri = encodeURIComponent(`${window.location.origin}/api/auth/discord/callback`)

  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`

  window.open(discordAuthUrl, "Discord OAuth", "height=600,width=800")
}
