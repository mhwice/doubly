import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  // emailVerification: {
  //   sendOnSignUp: true
  // }

  plugins: [nextCookies()] // make sure this is the last plugin in the array
});
