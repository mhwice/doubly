"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schema";
import * as z from "zod";
import { auth } from "@/utils/auth";
import { APIError } from "better-auth/api";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid email" };

  const { email } = validatedFields.data;

  // const existingUser = await getUserByEmail(email);
  // if (!existingUser) return { error: "Email not found" };

  // const passwordResetToken = await generatePasswordResetToken(email);
  // await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  try {
    await auth.api.forgetPassword({
      body: { email, redirectTo: "/auth/new-password" }
    });

  } catch (error: unknown) {
    if (error instanceof APIError) {
      return { error: error.message };
    } else {
      return { error: "Something went wrong" };
    }
  }


  return { success: "Password reset email sent" };
}
