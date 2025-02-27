import { auth } from "@/auth";
import type { CustomUser } from "@/auth"

export const currentUser = async () => {
  const session = await auth();
  if (session?.user) return session.user as CustomUser;
  return undefined;
}

export const currentRole = async () => {
  const session = await auth();
  if (session?.user) return (session.user as CustomUser).role;
  return undefined;
}
