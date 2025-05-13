"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewPasswordSchema } from "@/schema";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { authClient } from "@/utils/auth-client";
import { PasswordInput } from "@/components/doubly/ui/password-input";
import { Button } from "@/components/doubly/ui/button";

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
            <FormField control={form.control} name="password" render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} disabled={isLoading || !!error} placeholder="••••••••" fullWidth />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button fullWidth loading={isLoading}>Reset Password</Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
