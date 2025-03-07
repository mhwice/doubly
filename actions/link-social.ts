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
    // const res = await auth.api.linkSocialAccount({
    //   body: {
    //     provider: "github",
    //     callbackURL: "/settings"
    //   },
    //   headers: await headers()
    // });

    const accounts = await auth.api.listUserAccounts({
      headers: await headers()
    });

    const providers = accounts.map((account) => account.provider);
    console.log(providers); // ["credentials", "github"]

    return { done: "yaya" }

    // url = res?.url || "";

  } catch (error: unknown) {
    console.log(error);
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  // redirect(url);

  // return { success: "Password reset email sent" };
}
