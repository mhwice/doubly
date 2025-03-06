"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { newPassword } from "@/actions/better-new-password";
import { NewPasswordSchema } from "@/schema";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { authClient } from "@/utils/auth-client";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();

  /*

  If the token that is passed in the url is invalid, we get this:

  http://localhost:3000/auth/new-password?error=INVALID_TOKEN

  If that is the case, we need to figure out what to do.
  There are 2 things that may have happened.

  1. Better-auth messed up.
  2. Someone just randomly visited /auth/new-password without a valid token.

  Either way, I can just say "invalid token" and they can navigate back to the home page.

  */

  const token = searchParams.get("token");
  const queryError = searchParams.get("error");

  const [error, setError] = useState<string | undefined>(queryError || "");
  const [success, setSuccess] = useState<string | undefined>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    if (!token) return;
    const { data, error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    console.log({ data });
    console.log({ error });  // error.message = 'invalid token'
    // startTransition(() => {
    //   newPassword(values, token).then((data) => {
    //     if (data?.error) setError(data?.error);
    //     if (data?.success) setSuccess(data?.success);
    //   });
    // });
  }

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending || !!error}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !!error}
          >
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
