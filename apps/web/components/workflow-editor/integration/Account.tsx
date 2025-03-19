"use client"

import { Button } from "@repo/ui";
import { useEffect } from "react";

export default function Account() {

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/google/callback`;
    const scope = "https://mail.google.com/ https://www.googleapis.com/auth/user.emails.read https://www.googleapis.com/auth/userinfo.profile";

    // Use 'state' to indicate it's a popup flow
    const state = encodeURIComponent(JSON.stringify({ popup: true }));

    //
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&prompt=consent&state=${state}`;

    //to open a popup window
    window.open(
      googleAuthUrl,
      "Google Sign In",
      "height=600,width=800"
    );
  };
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        //fetch the connection details

        // console.log(event)
        // console.log(event.data.type)
      }
    };

    //to listen messages from another window(popup) i.e connection status
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);


  return (
    <div>
      <Button onClick={handleGoogleLogin}>Connect</Button>
    </div>
  );
}