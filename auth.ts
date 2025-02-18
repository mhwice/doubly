import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole
    } & DefaultSession["user"]
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          id: token.sub
        }
      }

      return {
        ...session,
        user: {
          ...session.user,
          role: token.role
        }
      };
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});


/*

token = {
  name: 'Test',
  email: 'test@example.com',
  picture: null,
  sub: 'cm78ofm7k000012aazzrc06ar',
  iat: 1739836127,
  exp: 1742428127,
  jti: '9da9426e-7142-4800-9779-89e03073ab50'
}

*/
