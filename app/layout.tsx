import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SessionProviderWrapper from "../providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { DM_Sans } from "next/font/google"
import { Navbar } from "@/components/navbar/Navbar";

const dm_sans = DM_Sans({
  variable: "--font-dm-sans",
  style: "normal",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "HyperPipe",
  description: "Automated your workflows",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${dm_sans.className} antialiased`}
      >
        <SessionProviderWrapper session={session}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Navbar />
            {children}
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
