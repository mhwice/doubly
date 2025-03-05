"use server";

import { ResetSchema } from "@/schema";
import * as z from "zod";
import { auth } from "@/utils/auth";
import { APIError } from "better-auth/api";

/*
Currently, you are allowed to send a password reset email to an email addres which you have not verified.
You are correctly permitted from sending an email that does not exist inside the database however.
*/

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid email" };

  const { email } = validatedFields.data;

  try {
    const x = await auth.api.forgetPassword({
      body: { email, redirectTo: "/auth/new-password" }
    });

    console.log("no error here?", x)

  } catch (error: unknown) {
    console.log("error right ehre")
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong" };
  }

  return { success: "Password reset email sent" };
}
