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
      // console.log("[SEND_VERIFICATION_EMAIL]", user); // name, email, emailVerified
      // console.log("[SEND_VERIFICATION_EMAIL]", url); // http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJlc2VuZC5leHRlbmRpbmcwMzVAcGFzc2luYm94LmNvbSIsImlhdCI6MTc0MTEyMzA2OCwiZXhwIjoxNzQxMTI2NjY4fQ.lfj7_4b_jFb7B_lm8En9SdAJmMQmsb3C_830FfHXKQ8&callbackURL=/
      // console.log("[SEND_VERIFICATION_EMAIL]", token); // eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJlc2VuZC5leHRlbmRpbmcwMzVAcGFzc2luYm94LmNvbSIsImlhdCI6MTc0MTEyMzA2OCwiZXhwIjoxNzQxMTI2NjY4fQ.lfj7_4b_jFb7B_lm8En9SdAJmMQmsb3C_830FfHXKQ8
      // console.log("[SEND_VERIFICATION_EMAIL]", request); // undefined
      await sendBetterVerificationEmail(user.email, url);
    }
  },

  plugins: [nextCookies()] // make sure this is the last plugin in the array
});


/*

Things to ask online about:

When a we pass an email address to:
await auth.api.forgetPassword({ body: { email, redirectTo: "/auth/new-password" } });
that does not exist in the db, this returns a status 200 instead of throwing an error.

Also, is there a way to tell better-auth to not allow forgetPassword to send an email unless the user is already verified?

*/
