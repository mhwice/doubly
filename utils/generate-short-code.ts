import { env } from "@/data-access/env";
import { customAlphabet } from "nanoid";

// to determine change of collision
// https://zelark.github.io/nano-id-cc/
export function makeCode() {
  try {
    const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 12);
    return nanoid();
  } catch (error) {
    return null;
  }

}

export function makeShortUrl(code: string) {
  return `${env.APP_URL}/${code}`;
}
