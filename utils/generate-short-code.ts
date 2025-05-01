import { env } from "@/data-access/env";
import { customAlphabet } from "nanoid";

const unallowedCodes = [
  "dashboard",
  "dashboard/settings",
  "dashboard/analytics",
  "dashboard/links",
  "api",
  "api/auth",
  "api/filter",
  "api/query",
  "api/liks",
  "auth",
  "auth/login",
  "auth/register",
  "auth/forgot-password",
  "auth/new-password",
  "auth/error",
  "learn-more",
];

// to determine change of collision
// https://zelark.github.io/nano-id-cc/
export function makeCode() {
  try {
    const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 12);
    const NUM_RETRIES = 3;
    for (let i = 0; i < NUM_RETRIES; i += 1) {
      const code = nanoid();
      if (!unallowedCodes.includes(code)) return code;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function makeShortUrl(code: string) {
  return `${env.APP_URL}/${code}`;
}
