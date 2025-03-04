"use server";

import { z } from "zod";
import { LoginSchema } from "@/schema";
import { auth } from "@/utils/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };
  const { email, password, code } = validatedFields.data;

  try {
    await auth.api.signInEmail({
      body: { email, password, callbackURL: "/better-settings" },
    });
    // console.log({ redirect, token, url, user })
    console.log("successfull signin");

  } catch (error: unknown) {
    if (error instanceof APIError) {
      return { error: error.message };
      // console.log("expected error", {
        //   body: error.body,
        //   cause: error.cause,
        //   headers: error.headers,
        //   message: error.message,
        //   name: error.name,
        //   stack: error.stack,
        //   status: error.status,
        //   statusCode: error.statusCode,
        // });
      } else {
        console.log("no idea man", error);
        return { error: "Something went wrong" };
      }
    }

    redirect("/better-settings");
  // return { success: "User signed in" };
}
