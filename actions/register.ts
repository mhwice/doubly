"use server";

import { z } from "zod";
import { RegisterSchema } from "@/schema";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };
  const { email, password, name } = validatedFields.data;

  try {
    await auth.api.signUpEmail({
      // this callbackURL is where I get sent when I verify my email address.
      body: { email, password, name, callbackURL: "/payments" },
    });

  } catch (error: unknown) {
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  return { success: "User registered" };
};
