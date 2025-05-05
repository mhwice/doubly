"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./social";
import { Separator } from "@/components/ui/separator"

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps) => {
  return (
    <Card className="w-[420px] shadow-none border-0 sm:border border-vborder">
      <CardHeader>
        <Header label={headerLabel}/>
      </CardHeader>
      {showSocial && (
        <CardContent>
          <Social />
          <div className="relative mt-5 text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border after:border-vborder">
            <span className="relative z-10 bg-background px-2 text-vsecondary">
              or continue with
            </span>
          </div>
        </CardContent>
      )}
      <CardContent>
        {children}
      </CardContent>
      {/* {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )} */}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
