"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "@/actions/login";
import { LoginSchema } from "@/schema";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components//ui/button";
import { FormError } from "@/components/form-error";
import { LoadingButton } from "@/components/auth/loading-button";
import { PasswordInput } from "@/components/password-input";

export const LoginForm = () => {

  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");

    startTransition(async () => {
      await login(values).then((data) => {
        setError(data?.error);
      });
    });
  }

  return (
    <CardWrapper headerLabel="Welcome back" backButtonLabel="Don't have an account?" backButtonHref="/auth/register" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="john.doe@example.com" type="email" className="shadow-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    {/* <Input {...field} disabled={isPending} placeholder="******" type="password" /> */}
                    <PasswordInput {...field} disabled={isPending} placeholder="******" />
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
          <LoadingButton loading={isPending}>Login</LoadingButton>
        </form>
      </Form>
    </CardWrapper>
  );
}
