"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { newPassword } from "@/actions/new-password";
import { NewPasswordSchema } from "@/schema";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { LoadingButton } from "@/components/auth/loading-button";
import { authClient } from "@/utils/auth-client";
import { TextInput } from "@/components/text-input";
import { PasswordInput } from "@/components/password-input";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const queryError = searchParams.get("error");

  const [error, setError] = useState<string | undefined>(queryError || "");
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    setSuccess("");

    if (!token) {
      setError("Invalid token");
      return;
    };

    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.resetPassword({
        newPassword: values.password,
        token: token
      });

      if (error) setError(error.message);
      if (data) setSuccess("Password successfully reset!");
    } catch (error) {
      console.error("Failed to reset password", error);
      setError("Something went wrong, please try again in a few minutes");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CardWrapper headerLabel="Enter a new password" backButtonLabel="Back to login" backButtonHref="/auth/login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    {/* <Input {...field} disabled={isLoading || !!error} placeholder="******" type="password"  className="shadow-none border-vborder"/> */}
                    <PasswordInput {...field} disabled={isLoading || !!error} placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <LoadingButton loading={isLoading}>Reset Password</LoadingButton>
        </form>
      </Form>
    </CardWrapper>
  );
}
