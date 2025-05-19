"use client";

import { useSWRConfig } from 'swr'

import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { createLink } from "@/actions/create-link";
import { BaseModal } from "./base-modal";
import { useCurrentDate } from '@/app/dashboard/date-context';
import { Input } from './doubly/ui/input';
import { cleanUrl } from '@/app/dashboard/links/components/columns';

interface CustomDialogProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const LinkSchema = z
  .object({
    link: z.string().trim().min(1, { message: "link is required" }),
  }).transform(({ link }) => {
    if (link.startsWith("https://")) return { link };
    return { link: "https://" + link };
  })
  .refine(({ link }) => {
    try {
      const url = new URL(link);
      return url.protocol === "https:";
    } catch {
      return false;
    }
  }, { message: "must be a valid url" })

export function CreateLinkModal({ isOpen, onOpenChange }: CustomDialogProps) {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const { date: now, setDate } = useCurrentDate();
  const { mutate } = useSWRConfig();

  const form = useForm<z.infer<typeof LinkSchema>>({
    resolver: zodResolver(LinkSchema),
    defaultValues: {
      link: "",
    },
  });

  const handleSubmit = () => {

    form.handleSubmit(async (values) => {
      const validatedFields = LinkSchema.safeParse(values);
      if (!validatedFields.success) {
        setError("Invalid fields");
        return;
      }

      const { link } = validatedFields.data;
      setError("");

      try {
        const response = await createLink({ originalUrl: link });
        if (!response.success) setError(response.error);
        else {
          const params = new URLSearchParams();
          const newNow = new Date();
          setDate(newNow);
          // params.append("dateEnd", newNow.toISOString());
          // const url = `/api/links?${params.toString()}`;
          // mutate(url);
          onOpenChange(false);
        }
      } catch (error) {
        console.error(error);
        setError("Something went wrong, please try again in a few minutes");
      }
    }, (errors) => {
      // console.error("Validation errors:", errors);
      setError("Invalid url");
    })();
  };


  return (

    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create Link"
      description="This is the URL you want your users to visit. All traffic to this URL will be tracked."
      onSubmit={handleSubmit}
      isPending={isPending}
      submitLabel="Create"
      disableSubmit={!form.formState.isDirty}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} value={cleanUrl(field.value)} fullWidth prefix="https://" placeholder="www.google.com" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
        </form>
      </Form>
    </BaseModal>
  );
}
