"use server";

import { ResetSchema } from "@/schema";
import * as z from "zod";
import { auth } from "@/utils/auth";
import { APIError } from "better-auth/api";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid email" };

  const { email } = validatedFields.data;

  try {
    const { status } = await auth.api.forgetPassword({
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
