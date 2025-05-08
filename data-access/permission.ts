import { env } from "./env";

export function isAllowed(userId: string) {
  return userId !== env.DEMO_UID;
}
