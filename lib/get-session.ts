import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession() {
  try {
    return await auth.api.getSession({
      headers: await headers()
    });
  } catch (error) {
    return null;
  }
}
