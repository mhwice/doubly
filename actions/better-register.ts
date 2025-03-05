"use server";

import { z } from "zod";
import { RegisterSchema } from "@/schema";
import { auth } from "@/utils/auth";
import { APIError } from "better-auth/api";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };
  const { email, password, name } = validatedFields.data;

  try {
    await auth.api.signUpEmail({
      body: { email, password, name, callbackURL: "/better-settings" },
    });

  } catch (error: unknown) {
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  return { success: "User registered" };
};
