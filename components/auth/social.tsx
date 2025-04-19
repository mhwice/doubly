"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaApple } from "react-icons/fa";

import { Button } from "../ui/button";
// import { authClient } from "@/utils/auth-client";

export const Social = () => {
  const onClick = async (provider: "google" | "github" | "apple") => {
    // await authClient.signIn.social({
    //   provider,
    //   callbackURL: "/settings",
    //   errorCallbackURL: "/oopsy"
    // });
  }

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className="w-full" variant="flat" onClick={() => onClick("google")}>
        <FcGoogle className="h-5 w-5"/> Google
      </Button>
      <Button size="lg" className="w-full" variant="flat" onClick={() => onClick("github")}>
        <FaGithub className="h-5 w-5"/> GitHub
      </Button>
    </div>
  );
};
