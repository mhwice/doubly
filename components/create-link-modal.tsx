"use client";

import { useTransition } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { createLink } from "@/actions/create-link";
import { BaseModal } from "./base-modal";
import { useCurrentDate } from '@/app/dashboard/date-context';
import { Input } from './doubly/ui/input';
import { cleanUrl } from '@/app/dashboard/links/components/columns';
import { LinkCreateLinkSchema } from '@/lib/zod/links';

interface CustomDialogProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

// I want to replace this, but its better to wait for Zod v4 which has better url handling
const LinkSchema = z
  .object({
    originalUrl: z.string().trim().min(1, { message: "link is required" }),
  }).transform(({ originalUrl }) => {
    if (originalUrl.startsWith("https://")) return { originalUrl };
    return { originalUrl: "https://" + originalUrl };
  })
  .refine(({ originalUrl }) => {
    try {
      const url = new URL(originalUrl);
      return url.protocol === "https:";
    } catch {
      return false;
    }
  }, { message: "must be a valid url" })

export function CreateLinkModal({ isOpen, onOpenChange }: CustomDialogProps) {
  const [isPending, startTransition] = useTransition();

  const { setDate } = useCurrentDate();

  const form = useForm<z.infer<typeof LinkSchema>>({
    resolver: zodResolver(LinkSchema),
    defaultValues: {
      originalUrl: "",
    },
  });

  const onSubmit = form.handleSubmit(({ originalUrl }) => {
    startTransition(async () => {
      try {
        const res = await createLink({ originalUrl });
        if (res.success) {
          // [TODO] use optimistic update to make faster
          setDate(new Date());
          onOpenChange(false);
        } else {
          form.setError("root", { message: res.error });
        }
      } catch {
        form.setError("root", { message: "Something went wrong. Please try again." });
      }
    });
  });

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create Link"
      description="This is the URL you want your users to visit. All traffic to this URL will be tracked."
      onSubmit={onSubmit}
      isPending={isPending}
      submitLabel="Create"
      disableSubmit={!form.formState.isDirty}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <FormField
            control={form.control}
            name="originalUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} error={form.formState.errors.originalUrl?.message} value={cleanUrl(field.value)} fullWidth prefix="https://" placeholder="www.google.com" disabled={isPending} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormError message={form.formState.errors.root?.message} />
        </form>
      </Form>
    </BaseModal>
  );
}
