import { betterAuth } from "better-auth";
// import { twoFactor } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { sendBetterPasswordResetEmail, sendBetterVerificationEmail } from "@/lib/mail";
import { env } from "@/data-access/env";

export const auth = betterAuth({
  appName: "Doubly",
  baseURL: env.BETTER_AUTH_URL,
  database: new Pool({
    connectionString: env.DATABASE_URL
  }),
  account: {
    accountLinking: {
      enabled: true,
    }
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendBetterPasswordResetEmail(user.email, url, user.name);
    },
    ...(env.ENV === "dev" ? {
        password: {
          hash: async (password) => password,
          verify: async ({ hash, password }) => hash === password,
        },
      }
    : {})
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendBetterVerificationEmail(user.email, url, user.name);
    }
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }
  },
  plugins: [
    // twoFactor(),
    nextCookies(), // make sure this is the last plugin in the array
  ]
});

export type User = typeof auth.$Infer.Session.user;
