"use client";

import { useState, useTransition } from "react";

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

export const ForgotPasswordForm = () => {

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      await reset(values).then((data) => {
        if (data?.error) setError(data?.error);
        if (data?.success) setSuccess(data?.success);
      });
    });
  }

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="john.doe@example.com" type="email" className="shadow-none border-vborder"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <LoadingButton loading={isPending}>Send reset email</LoadingButton>
        </form>
      </Form>
    </CardWrapper>
  );
}
