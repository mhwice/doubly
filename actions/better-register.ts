"use server";

import { z } from "zod";
import { RegisterSchema } from "@/schema";
import bcrypt from "bcryptjs";
// import { auth } from "@/utils/auth";

import { authClient } from "@/utils/auth-client";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await authClient.signUp.email({
    email: "test@example.com",
    password: "password1234",
    name: "test",
    image: "https://example.com/image.png",
  });

  console.log("data", data);
  console.log("error", error);

  return { success: "did something" };

  // auth.api.signUpEmail

  // const response = await auth.api.signInEmail({
  //     body: {
  //         email,
  //         password
  //     },
  //     asResponse: true // returns a response object instead of data
  // });

};



