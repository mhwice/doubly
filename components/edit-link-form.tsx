"use client";

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { LoadingButton } from "@/components/auth/loading-button";
import { createURL } from "@/actions/create-url";

const LinkSchema = z.object({
  link: z.string().min(1, { message: "link is required" }),
  password: z.string().min(1, { message: "pass is required" }),
});

interface EditLinkFormProps {
  userId: string,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const EditLinkForm = ({ userId, setIsOpen }: EditLinkFormProps) => {

  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LinkSchema>>({
    resolver: zodResolver(LinkSchema),
    defaultValues: {
      link: "",
      password: ""
    }
  });

  const onSubmit = (values: z.infer<typeof LinkSchema>) => {
    setError("");
    console.log(values)

    // todo: validate with zod

    startTransition(async () => {
      await createURL({
        url: values.link,
        password: values.password,
        userId
      }).then((data) => {
        setIsOpen(false);
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField control={form.control} name="link" render={({ field }) => (
            <FormItem>
              <FormLabel>Original link</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} placeholder="https://www.google.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} placeholder="******" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormError message={error} />
        <LoadingButton loading={isPending}>Create</LoadingButton>
      </form>
    </Form>
  );
}
