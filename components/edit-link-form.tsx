"use client";

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { createLink } from "@/actions/safe-create-link";
import { editLink } from "@/actions/safe-edit-link";
import { Button } from "./doubly/ui/button";

// import { useUser } from "@/app/dashboard/UserContext";

const LinkSchema = z.object({
  link: z.string().trim().url().min(1, { message: "link is required" }),
  // password: z.string().min(1, { message: "pass is required" }),
});

interface EditLinkFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  link?: string,
  isEditing: boolean,
  id?: number
}

export const EditLinkForm = ({ setIsOpen, link, isEditing, id }: EditLinkFormProps) => {

  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  // const { userId } = useUser();

  const form = useForm<z.infer<typeof LinkSchema>>({
    resolver: zodResolver(LinkSchema),
    defaultValues: {
      link: link || ""
    }
  });

  const onSubmit = (values: z.infer<typeof LinkSchema>) => {

    const validatedFields = LinkSchema.safeParse(values);
    if (!validatedFields.success) return { error: "invalid fields" };

    const { link } = validatedFields.data;

    setError("");

    startTransition(async () => {
      let error: string | undefined = undefined;
      if (isEditing) {
        const updates = { originalUrl: link };
        if (id === undefined) {
          error = "no id provided"
        } else {
          const response = await editLink({ id, updates });
          // error = response.error;
        }
      } else {
        const response = await createLink({ originalUrl: link });
        // error = response.error;
      }

      if (error) setError(error);
      else setIsOpen(false);
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
                <Input {...field} disabled={isPending} placeholder="https://www.google.com" className="shadow-none border-vborder"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          {/* <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} placeholder="******" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} /> */}
        </div>
        <FormError message={error} />
        <Button fullWidth loading={isPending}>{isEditing ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
}
