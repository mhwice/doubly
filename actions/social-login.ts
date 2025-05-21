"use server";

import { SocialSchema } from "@/schema";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

export const socialLogin = async (values: unknown) => {
  const validatedFields = SocialSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };
  const { provider } = validatedFields.data;

  try {
    const res = await auth.api.signInSocial({
      body: {
        provider: provider,
        callbackURL: "/dashboard/links",
        disableRedirect: true,
        errorCallbackURL: "/"
      }
    });

    if (!res.url) {
      throw new Error("No URL returned from signInSocial");
    }
    return { url: res.url };

  } catch (error: unknown) {
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  return { success: "Logged in" };
};
