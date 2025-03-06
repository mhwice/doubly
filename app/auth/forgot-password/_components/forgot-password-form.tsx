"use client";

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { ResetSchema } from "@/schema";
import { reset } from "@/actions/better-reset";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { authClient } from "@/utils/auth-client";
import { sleep } from "@/utils/helper";

export const ForgotPasswordForm = () => {

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  // const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ""
    }
  });



  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    // startTransition(() => {

    // });

    // await sleep(10000);
    // setSuccess("done")

    const { data, error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/auth/new-password",
    });

    if (error) {
      setError("Something went wrong");
    } else {
      // An email is only sent to the user if they exist
      // Otherwise we don't send an email but still tell them that we did
      setSuccess("Password reset email sent");
    }

    // startTransition(() => {
    //   reset(values).then((data) => {
    //     if (data?.error) setError(data?.error);
    //     if (data?.success) setSuccess(data?.success);
    //   });
    // });
  }

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="john.doe@example.com"
                      type="email"
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Loader2 className="animate-spin"/>}
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
