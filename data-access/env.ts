// import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().trim().min(1),
  GITHUB_CLIENT_ID: z.string().trim().min(1),
  GITHUB_CLIENT_SECRET: z.string().trim().min(1),
  GOOGLE_CLIENT_ID: z.string().trim().min(1),
  GOOGLE_CLIENT_SECRET: z.string().trim().min(1),
  RESEND_API_KEY: z.string().trim().min(1),
  BETTER_AUTH_URL: z.string().trim().min(1),
  APP_URL: z.string().trim().min(1),
  ENV: z.enum(["dev", "prod"])
});

const envServer = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  APP_URL: process.env.APP_URL,
  ENV: process.env.ENV,
});

if (!envServer.success) {
  console.error(envServer.error.issues);
  throw new Error('There is an error with the server environment variables');
}

export const env = envServer.data;
