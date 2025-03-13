"use server";

import { z } from "zod";
import { LoginSchema } from "@/schema";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };
  // TODO: validatedFields also contains a 'code' why?
  const { email, password } = validatedFields.data;

  try {
    await auth.api.signInEmail({
      body: { email, password, callbackURL: "/dashboard" },
    });

  } catch (error: unknown) {
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  redirect("/dashboard");
}
