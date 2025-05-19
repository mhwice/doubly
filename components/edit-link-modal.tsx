"use client";

import { useSWRConfig } from 'swr'

import { useEffect, useState, useTransition } from "react";

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
import { BaseModal } from "./base-modal";
import { editLink } from "@/actions/edit-link";
import { useCurrentDate } from '@/app/dashboard/date-context';
import { Input } from './doubly/ui/input';
import { cleanUrl } from '@/app/dashboard/links/components/columns';

interface CustomDialogProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  link: string;
  id: number;
}

// Todo validate that the string looks like a url
const LinkSchema = z
  .object({
    link: z.string().trim().min(1, { message: "link is required" }),
  })
  .transform(({ link }) => {
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

export function EditLinkModal({ isOpen, onOpenChange, link, id }: CustomDialogProps) {
  const [error, setError] = useState<string | undefined>();
  // const [isPending, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);

  const { date: now, setDate } = useCurrentDate();
  const { mutate } = useSWRConfig();

  const form = useForm<z.infer<typeof LinkSchema>>({
    resolver: zodResolver(LinkSchema),
    defaultValues: {
      link: link,
    },
  });

  useEffect(() => {
    if (link) {
      form.reset({ link });
    }
  }, [link, form]);

  useEffect(() => {
    if (!isOpen) {
      form.reset({ link });
    }
  }, [isOpen])

  const handleSubmit = () => {
    setIsPending(true);
    form.handleSubmit(async (values) => {
      const validatedFields = LinkSchema.safeParse(values);
      if (!validatedFields.success) {
        setError("Invalid fields");
        return;
      }

      const { link } = validatedFields.data;
      setError("");

      try {
        const data = await editLink({ id: id, updates: { originalUrl: link } });
        const params = new URLSearchParams();
        const newNow = new Date();
        setDate(newNow);
        // params.append("dateEnd", newNow.toISOString());
        // const url = `/api/links?${params.toString()}`;
        // mutate(url);
        onOpenChange(false);
      } catch (error) {
        setError("Unable to update link");
      } finally {
        setIsPending(false);
      }
    })();
  };


  return (

    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Link"
      description="Change the Url your users will be redirected to"
      onSubmit={handleSubmit}
      isPending={isPending}
      submitLabel="Save"
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
                  <Input {...field} value={cleanUrl(field.value)} prefix="https://" fullWidth placeholder="www.google.com" disabled={isPending} />
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
