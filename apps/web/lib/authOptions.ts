import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@repo/db/prisma"
import bcrypt from "bcryptjs"


export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      //authorization => optional for user login
      authorization: {
        params: {
          // Scope Reference => https://developers.google.com/identity/protocols/oauth2/scopes#google-sign-in
          scope: "openid profile email",
          prompt: 'consent',
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: 'Email', type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          throw new Error("All fields are required")
        }

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          }
        })

        if (!user || !user.password) {
          throw new Error("User does not exist")
        }

        const isPassword = await bcrypt.compare(credentials.password, user.password)

        if (!isPassword) {
          throw new Error("Password is incorrect")
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        }
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user, account }) => {
      if (account) {
        token.accessToken = account.access_token as string | undefined;
        token.refreshToken = account.refresh_token as string | undefined;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name,
          email: token.email,
        }
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }

      return session
    }
  }
}