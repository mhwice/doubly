"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const logout = async () => {

  try {
    await auth.api.signOut({ headers: await headers() });

  } catch (error: unknown) {
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  redirect("/");
}
