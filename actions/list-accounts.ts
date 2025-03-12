"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";

export const listAccounts = async () => {

  try {
    const accounts = await auth.api.listUserAccounts({
      headers: await headers()
    });

    const providers = accounts.map((account) => account.provider);
    return { data: providers };

  } catch (error: unknown) {
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }
}
