import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { sendBetterPasswordResetEmail, sendBetterVerificationEmail } from "@/lib/mail";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendBetterPasswordResetEmail(user.email, url);
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendBetterVerificationEmail(user.email, url);
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
    }
  },
  plugins: [nextCookies()] // make sure this is the last plugin in the array
});

export type User = typeof auth.$Infer.Session.user;


/*

Things to ask online about:

When a we pass an email address to:
await auth.api.forgetPassword({ body: { email, redirectTo: "/auth/new-password" } });
that does not exist in the db, this returns a status 200 instead of throwing an error.

Also, is there a way to tell better-auth to not allow forgetPassword to send an email unless the user is already verified?

*/
