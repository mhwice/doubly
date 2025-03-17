import { env } from "@/data-access/env";
import { nanoid } from "nanoid";

export function makeCode() {
  return nanoid(6);
}

export function makeShortUrl(code: string) {
  return `${env.APP_URL}/${code}`;
}
