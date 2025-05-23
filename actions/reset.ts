"use server";

import { ResetSchema } from "@/schema";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

export const reset = async (values: unknown) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid email" };

  const { email } = validatedFields.data;

  try {
    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: "/auth/new-password"
      }
    });

  } catch (error: unknown) {
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  return { success: "Password reset email sent" };
}
