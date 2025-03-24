"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const unlinkSocial = async (provider: "github" | "google" | "apple") => {

  let url = "";
  try {

    const res = await auth.api.unlinkAccount({
      body: {
        providerId: provider,
        accountId: ""
      },
      headers: await headers()
    });

    console.log(res);

    // const res = await auth.api.linkSocialAccount({
    //   body: {
    //     provider,
    //     callbackURL: "/settings"
    //   },
    //   headers: await headers()
    // });

    // url = res?.url;

  } catch (error: unknown) {
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  // redirect(url);
}
