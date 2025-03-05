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

It seems to me that I don't need to manually create the verication email url - better-auth does that for me.
So I can change my function signature to

sendBetterVerificationEmail(url)

and I can optionall include tehe users name as well.

*/
