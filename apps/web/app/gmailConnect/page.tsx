"use client"

import React from 'react';

export default function gmailConnect() {
  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/google/callback`;
    const scope = 'https://mail.google.com/ https://www.googleapis.com/auth/user.emails.read https://www.googleapis.com/auth/userinfo.profile';

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div>
      <h1>Connect to Gmail</h1>
      <button onClick={handleGoogleLogin}>
        Connect with Google
      </button>
    </div>
  );
};
