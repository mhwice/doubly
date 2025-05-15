"use client";

import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook, FaGithub } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { linkSocial } from "@/actions/link-social";
import { useState, useTransition } from "react";

interface OAuthProvidersProps {
  accounts: string[];
}

/*

Next steps
1. I can now successfully link/unlink accounts by calling the link/unlink server actions.
   Now what I want is to add some logic that will call the correct server action depending on
   the current state. For example, if Github is not linked, clicking the button should link it.
   If Github is currently linked, clicking the button should unlink it.
2. UI - when clicking the link/unlink button, I want to see a loading spinner.
3. I think the unlink server action needs a revalidatePath call as well.


*/

export default function OAuthProviders({ accounts }: OAuthProvidersProps) {

  const [isPending, startTransition] = useTransition();
  const [githubLinked, setGithubLinked] = useState(false);
  const linkGithub = () => {
    startTransition(async () => {
      await linkSocial("github").then((data) => {
        // console.log("ere", data);
      });

      // await listAccounts().then((data) => {
      //   if (data.data) {
      //     for (const acc of data.data) {
      //       if (acc === "github") setGithubLinked(true);
      //     }
      //   }
      // });

      // await unlinkSocial("github").then((data) => {
      //   console.log("bye", data);
      // })
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Providers</CardTitle>
        <CardDescription>Connect your account with a third-party service.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <FaGithub className="h-5 w-5" />
            <span>GitHub</span>
          </div>
          <Button onClick={() => linkGithub()} variant="default" className="bg-black hover:bg-black/90 text-white rounded-md px-4 py-1 h-8">
            {accounts.includes("github") ? "Unlink" : "Link"}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <FcGoogle className="h-5 w-5" />
            <span>Google</span>
          </div>
          <Button variant="default" className="bg-black hover:bg-black/90 text-white rounded-md px-4 py-1 h-8">
            {accounts.includes("google") ? "Unlink" : "Link"}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <FaFacebook className="h-5 w-5 text-blue-600" />
            <span>Facebook</span>
          </div>
          <Button variant="default" className="bg-black hover:bg-black/90 text-white rounded-md px-4 py-1 h-8">
            {accounts.includes("facebook") ? "Unlink" : "Link"}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <FaApple className="h-5 w-5" />
            <span>Apple</span>
          </div>
          <Button variant="default" className="bg-black hover:bg-black/90 text-white rounded-md px-4 py-1 h-8">
            {accounts.includes("apple") ? "Unlink" : "Link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
