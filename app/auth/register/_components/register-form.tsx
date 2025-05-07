"use client";

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schema";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { LoadingButton } from "@/components/auth/loading-button";
import { PasswordInput } from "@/components/password-input";
import { authClient } from "@/utils/auth-client";
import { TextInput } from "@/components/text-input";

export const RegisterForm = () => {

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard/links"
      });

      if (error) setError(error.message);
      if (data) setSuccess("Success! Please check your email to verify your account.");
    } catch (error) {
      console.error("Failed to register user", error);
      setError("Something went wrong, please try again in a few minutes");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CardWrapper headerLabel="Create an account" backButtonLabel="Already have an account?" backButtonHref="/auth/login" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >
          <div className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-vprimary">Name</FormLabel>
                  <FormControl>
                    {/* <Input {...field} disabled={isLoading} placeholder="John Doe" className="shadow-none border-vborder" /> */}
                    <TextInput disabled={isLoading} placeholder="John Doe" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-vprimary">Email</FormLabel>
                  <FormControl>
                    {/* <Input {...field} disabled={isLoading} placeholder="john.doe@example.com" type="email" className="shadow-none border-vborder"/> */}
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <LoadingButton loading={isLoading}>Create Account</LoadingButton>
        </form>
      </Form>
    </CardWrapper>
  );
}
