"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schema";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { authClient } from "@/utils/auth-client";
import { Input } from "@/components/doubly/ui/input";
import { PasswordInput } from "@/components/doubly/ui/password-input";
import { Button } from "@/components/doubly/ui/button";

export const RegisterForm = () => {

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard/links"
      });

      if (error) setError(error.message);
      if (data) setSuccess("Success! Please check your email to verify your account.");
    } catch (error) {
      console.error("Failed to register user", error);
      setError("Something went wrong, please try again in a few minutes");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CardWrapper headerLabel="Create an account" backButtonLabel="Already have an account?" backButtonHref="/auth/login" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >
          <div className="space-y-4">
            <FormField control={form.control} name="name" render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-medium text-vprimary">Name</FormLabel>
                  <FormControl>
                    <Input fullWidth disabled={isLoading} placeholder="John Doe" error={fieldState.error?.message} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField control={form.control} name="email" render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-medium text-vprimary">Email</FormLabel>
                  <FormControl>
                    <Input fullWidth disabled={isLoading} placeholder="john.doe@example.com" type="email" error={fieldState.error?.message} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField control={form.control} name="password" render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-medium text-vprimary">Password</FormLabel>
                  <FormControl>
                    <PasswordInput fullWidth {...field} disabled={isLoading} placeholder="••••••••" error={fieldState.error?.message} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button fullWidth loading={isLoading}>Create Account</Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
