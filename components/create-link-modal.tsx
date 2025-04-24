"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { createLink } from "@/actions/safe-create-link";
import { Loader2 } from "lucide-react";
import { UrlInput } from "./url-input";

interface CustomDialogProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

// Todo validate that the string looks like a url
const LinkSchema = z.object({
  link: z.string().trim().min(1, { message: "link is required" })
}).transform(({ link }) => {
  if (link.startsWith("https://")) return { link };
  return { link : "https://" + link };
});

export function CreateLinkModal({ isOpen, onOpenChange }: CustomDialogProps) {

  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LinkSchema>>({
    resolver: zodResolver(LinkSchema),
    defaultValues: {
      link: ""
    }
  });

  const onSubmit = (values: z.infer<typeof LinkSchema>) => {

    console.log("before", values)
    const validatedFields = LinkSchema.safeParse(values);
    if (!validatedFields.success) return { error: "invalid fields" };
    console.log("after", validatedFields.data)

    const { link } = validatedFields.data;

    setError("");

    startTransition(async () => {
      let error: string | undefined = undefined;
      const response = await createLink({ originalUrl: link });
      // error = response.error;

      if (error) setError(error);
      else onOpenChange(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onCloseAutoFocus={() => form.reset({})} className="sm:max-w-lg border-[#dedede] p-0 overflow-hidden sm:rounded-xl shadow-custom">
        <DialogHeader className="px-6 pb-2 pt-7">
          <DialogTitle className="text-vprimary text-2xl">Create Link</DialogTitle>
          <DialogDescription className="text-vsecondary">
            This is the URL you want your users to visit. All traffic to this URL will be tracked.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
        <Form {...form}>
          <form id="formid" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField control={form.control} name="link" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <UrlInput {...field} placeholder="www.google.com" disabled={false}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormError message={error} />
          </form>
        </Form>
        </div>
        <DialogFooter className="flex sm:justify-between border-t border-vborder bg-[var(--dashboard-bg)] p-4 px-6">
          <Button size="lg" variant="flat" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button form="formid" size="lg" type="submit" variant="defaultFlat" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin"/>}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
