"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "../doubly/ui/button";
import { authClient } from "@/utils/auth-client";
import { useState } from 'react';

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

    // setIsLoading(false);
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <div className="w-1/2">
        <Button
          variant="outline"
          fullWidth
          disabled={isLoading && (prov === "google")}
          loading={isLoading && (prov === "google")}
          onClick={() => onClick("google")}
          >
          <FcGoogle className="h-5 w-5"/> Google
        </Button>
      </div>
      <div className="w-1/2">
        <Button
          variant="outline"
          fullWidth
          disabled={isLoading && (prov === "github")}
          loading={isLoading && (prov === "github")}
          onClick={() => onClick("github")}
          >
          <FaGithub className="h-5 w-5"/> GitHub
        </Button>
        </div>
    </div>
  );
};
