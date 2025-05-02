"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "../ui/button";
import { authClient } from "@/utils/auth-client";
import { useState } from 'react';
import { Loader2 } from "lucide-react";

export const Social = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [prov, setProv] = useState<"google" | "github" | undefined>();

  const onClick = async (provider: "google" | "github") => {
    setIsLoading(true);
    setProv(provider);

     await authClient.signIn.social({
      provider,
      callbackURL: '/dashboard/links',
      errorCallbackURL: '/',
    });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      {/* {isPending ? 'Redirecting…' : 'Sign in with Google'} */}
      <Button disabled={isLoading} size="lg" className="w-full text-vprimary" variant="flat" onClick={() => onClick("google")}>
        {isLoading && prov === "google" ? <Loader2 className="animate-spin"/> : <><FcGoogle className="h-5 w-5"/> Google</>}
      </Button>
      <Button disabled={isLoading} size="lg" className="w-full text-vprimary" variant="flat" onClick={() => onClick("github")}>
        {isLoading && prov === "github" ? <Loader2 className="animate-spin"/> : <><FaGithub className="h-5 w-5"/> GitHub</>}
      </Button>
    </div>
  );
};
