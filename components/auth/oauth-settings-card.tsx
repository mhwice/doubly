"use client";

import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook, FaGithub } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { linkSocial } from "@/actions/link-social";
// import { authClient } from "@/utils/auth-client";
// import { auth } from "@/utils/auth";
// import { headers } from "next/headers";
import { useState, useTransition } from "react";

export default function OAuthProviders() {

  const [isPending, startTransition] = useTransition();

  const linkGithub = () => {

    startTransition(async () => {
      await linkSocial("github").then((data) => {
        console.log("ere", data);
      });
    });

    // const x = await authClient.linkSocial({
    //   provider: "github",
    //   callbackURL: "/settings"
    // });

    // console.log(x);
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
            Link
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <FcGoogle className="h-5 w-5" />
            <span>Google</span>
          </div>
          <Button variant="default" className="bg-black hover:bg-black/90 text-white rounded-md px-4 py-1 h-8">
            Link
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <FaFacebook className="h-5 w-5 text-blue-600" />
            <span>Facebook</span>
          </div>
          <Button variant="default" className="bg-black hover:bg-black/90 text-white rounded-md px-4 py-1 h-8">
            Link
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <FaApple className="h-5 w-5" />
            <span>Apple</span>
          </div>
          <Button variant="default" className="bg-black hover:bg-black/90 text-white rounded-md px-4 py-1 h-8">
            Link
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
