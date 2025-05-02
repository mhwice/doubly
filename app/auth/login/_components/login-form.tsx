"use client";

import { useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schema";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components//ui/button";
import { FormError } from "@/components/form-error";
import { LoadingButton } from "@/components/auth/loading-button";
import { PasswordInput } from "@/components/password-input";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/text-input";

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
        password: values.password
      });

      if (data) return router.push("/dashboard/links");
      if (error) setError(error.message);
    } catch (error) {
      console.error("Failed to sign in", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CardWrapper headerLabel="Sign in" backButtonLabel="Don't have an account?" backButtonHref="/auth/register" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-vprimary">Email</FormLabel>
                  <FormControl>
                    {/* <Input {...field} disabled={isLoading} placeholder="john.doe@example.com" type="email" className="shadow-none border-vborder" /> */}
                    <TextInput disabled={isLoading} placeholder="john.doe@example.com" type="email" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-vprimary">Password</FormLabel>
                  <FormControl>
                    {/* <Input {...field} disabled={isLoading} placeholder="******" type="password" /> */}
                    <PasswordInput {...field} disabled={isLoading} placeholder="••••••••" />
                  </FormControl>
                  <Button size="sm" variant="link" asChild className="px-0 font-normal">
                    <Link href="/auth/forgot-password">Forgot password?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <LoadingButton loading={isLoading}>Sign In</LoadingButton>
        </form>
      </Form>
    </CardWrapper>
  );
}
