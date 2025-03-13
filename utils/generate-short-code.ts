import { nanoid } from "nanoid";

export function makeCode() {
  return nanoid(6);
}

export function makeShortUrl(code: string) {
  return `http://localhost:3000/${code}`;
}
