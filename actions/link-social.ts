"use server";

import { ResetSchema } from "@/schema";
import * as z from "zod";
import { auth } from "@/utils/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const linkSocial = async (provider: string) => {


  let url = "";
  try {
    const res = await auth.api.linkSocialAccount({
      body: {
        provider: "github",
        callbackURL: "/settings"
      },
      headers: await headers()
    });

    url = res?.url || "";

  } catch (error: unknown) {
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  redirect(url);

  // return { success: "Password reset email sent" };
}
