"use server";

import { NewPasswordSchema } from "@/schema";
import * as z from "zod";
import { auth } from "@/utils/auth";

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {

  if (!token) return { error: "Missing token" };
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };
  const { password } = validatedFields.data;

  const x = await auth.api.resetPassword({
    body: {
      newPassword: password,
      token: token
    }
  });

  console.log("better-new-password", x);

  return { success: "Password updated" };
};
