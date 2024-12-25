import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  //to redirect to /home in dev mode 
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
