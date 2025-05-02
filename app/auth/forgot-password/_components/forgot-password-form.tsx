"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ResetSchema } from "@/schema";
import { reset } from "@/actions/reset";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { LoadingButton } from "@/components/auth/loading-button";
import { TextInput } from "@/components/text-input";
import { authClient } from "@/utils/auth-client";

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
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your email</FormLabel>
                  <FormControl>
                    {/* <Input {...field} disabled={isLoading} placeholder="john.doe@example.com" type="email" className="shadow-none border-vborder"/> */}
                    <TextInput disabled={isLoading} placeholder="john.doe@example.com" type="email" {...field}/>
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
