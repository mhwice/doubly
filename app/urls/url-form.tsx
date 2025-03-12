"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { nanoid } from "nanoid";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { saveLink } from "@/data-access/urls";
import { createURL } from "@/actions/create-url";

const FormSchema = z.object({
  url: z.string().url({
    message: "must be url"
  })
})

function isUrlValid(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function makeCode() {
  return nanoid(6);
}

// [TODO] - this params should be inferred, not hardcoded
export function InputForm({ userId }: { userId: string }) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { url } = data;
    if (!isUrlValid(url)) return;

    const code = makeCode();
    const shortURL = `http://localhost:3000/${code}`;

    await createURL(url, shortURL, code, userId);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-screen space-y-4 flex flex-col items-center h-full justify-center">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>url</FormLabel>
              <FormControl>
                <Input placeholder="https://www.google.com" {...field} />
              </FormControl>
              <FormDescription>
                enter some url
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
