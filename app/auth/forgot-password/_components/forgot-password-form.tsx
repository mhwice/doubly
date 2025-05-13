"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ResetSchema } from "@/schema";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { authClient } from "@/utils/auth-client";
import { Input } from "@/components/doubly/ui/input";
import { Button } from "@/components/doubly/ui/button";

export const ForgotPasswordForm = () => {

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    // await reset(values).then((data) => {
    //   if (data?.error) setError(data?.error);
    //   if (data?.success) setSuccess(data?.success);
    // });

    try {
      const { data, error } = await authClient.forgetPassword({
        email: values.email
      });

      if (error) setError(error.message);
      if (data) setSuccess("Password reset email sent!");
    } catch (error) {
      console.error("Failed to send password reset email", error);
      setError("Something went wrong, please try again in a few minutes");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField control={form.control} name="email" render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Enter your email</FormLabel>
                  <FormControl>
                    <Input fullWidth disabled={isLoading} placeholder="john.doe@example.com" type="email" error={fieldState.error?.message} {...field}/>
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
