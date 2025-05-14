"use client";

import { useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schema";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/doubly/ui/input";
import { PasswordInput } from "@/components/doubly/ui/password-input";
import { Button as ShadButton } from "@/components//ui/button";
import { FormError } from "@/components/form-error";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/doubly/ui/button";

export const LoginForm = () => {

  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard/links"
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to sign in", error);
      setError("Something went wrong, please try again in a few minutes");
      setIsLoading(false);
    } finally {
      // setIsLoading(false);
      // if successful don't stop the spinner and just wait for redirect
    }
  }

  return (
    <CardWrapper headerLabel="Sign in" backButtonLabel="Don't have an account?" backButtonHref="/auth/register" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
                  <ShadButton size="sm" variant="link" asChild className="px-0 font-normal">
                    <Link href="/auth/forgot-password">Forgot password?</Link>
                  </ShadButton>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <Button fullWidth loading={isLoading}>{isLoading ? "Signing in..." : "Sign in"}</Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
