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

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { url } = data;
    if (!isUrlValid(url)) return;

    // need to shorten
    // need random 7 digit code
    const code = makeCode();
    const shortURL = `http://localhost:3000/${code}`;

    // save in db

    // const saveObj = {
    //   id: "", // auto generated in db
    //   originalURL: url,
    //   shortURL: shortURL,
    //   code: code,
    //   linkClicks: "0", // db can set this with default of 0
    //   qrCodeClicks: "", // db can set this with default of 0
    //   createdAt: "", // db can make this
    //   userId: "123456", // this i need to provide. must get from the session., for now hardocde
    //   expirationDate: "", // optional, leave as null for now
    //   password: "", // optional, leave as null for now
    // }

    await createURL(url, shortURL, code, "123456");

    // const resp = saveLink(url, shortURL, code, "123456");
    // console.log(resp)
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
