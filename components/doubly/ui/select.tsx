import { SelectTrigger } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";

interface StyledSelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}
export function StyledSelectTrigger({ className, children }: StyledSelectTriggerProps) {
  return <SelectTrigger className={cn("bg-white hover:bg-xcomp-bg text-xtext border-xborder hover:border-xcomp-bg-active border transition shadow-none rounded-xmd text-xprimary data-[placeholder]:text-xprimary h-10 p-4 text-sm font-medium", className)}>{children}</SelectTrigger>
}
