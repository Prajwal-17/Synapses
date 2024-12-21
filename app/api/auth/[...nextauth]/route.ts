import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login"
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: 'Email', type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        if (!credentials?.email || !credentials.password) {
          throw new Error("All fields are required")
        }

        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            }
          })

          if (!user) {
            throw new Error("User does not exist")
          }

          const isPassword = bcrypt.compare(credentials.password, user.password)

          if (!isPassword) {
            throw new Error("Password is incorrect")
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        } catch (error) {
          console.log(error)
        }
        return null
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {

      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
        }
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
      }

      return session
    }
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };