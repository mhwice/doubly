"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const linkSocial = async (provider: "github" | "google" | "apple") => {

  let url = "";
  try {
    const res = await auth.api.linkSocialAccount({
      body: {
        provider,
        callbackURL: "/admin"
      },
      headers: await headers()
    });

    url = res?.url;

  } catch (error: unknown) {
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  revalidatePath("/admin");
  redirect(url);
}
