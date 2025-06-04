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
import { OriginalUrlSchema } from "@/lib/zod/links";
import { writeToKV } from "@/data-access/cloudflare-kv";

interface CustomDialogProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateLinkModal({ isOpen, onOpenChange }: CustomDialogProps) {
  const [isPending, startTransition] = useTransition();

  const { setDate } = useCurrentDate();

  const form = useForm<z.infer<typeof OriginalUrlSchema>>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(OriginalUrlSchema),
    defaultValues: {
      originalUrl: "",
    },
  });

  const onSubmit = form.handleSubmit(({ originalUrl }) => {
    startTransition(async () => {
      try {
        const res = await createLink({ originalUrl });
        if (res.success) {
          const { code, originalUrl, id } = res.data;
          // populate kv cache with fire and forget.
          writeToKV(code, originalUrl, id).catch((e) => {
            console.error("failed to write to kv", e);
          });

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
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.clearErrors("root");
                      form.clearErrors("originalUrl");
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();  // avoid native form submit
                        onSubmit();          // call your RHF submit
                      }
                    }}
                    error={form.formState.errors.originalUrl?.message}
                    value={cleanUrl(field.value)}
                    fullWidth
                    prefix="https://"
                    placeholder="www.google.com"
                    disabled={isPending}
                  />
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
