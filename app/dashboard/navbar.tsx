"use client";

import { AnimatedTabs } from "./animated-tabs";
import { DatabaseLogo } from "../landing/DatabaseLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, ChevronsUpDown, House, LogOut, Settings2, User } from "lucide-react";
import { DropdownUserProfile } from "./user-dropdown";
import { UserNav } from "./new-user-dropdown";

interface NavbarProps {
  image: string,
  name: string,
  email: string
}

export function VercelNavbar({ image, name, email }: NavbarProps) {
  return (
    <div style={{ display: 'contents' }} className="flex flex-col w-full">
      <div className="h-14 w-full bg-background transition-all duration-300 ease-in-out mt-5">
        <div className="flex align-self justify-between items-center mx-[15%]">
          <DatabaseLogo className="w-28 md:w-32" />
          {/* <DropdownUserProfile email={email} /> */}
          <UserNav email={email} name={name} image={image} />
        </div>
      </div>

      <div className="sticky top-0 py-[5px] w-full border-b shadow-none z-50 transition-all duration-300 ease-in-out bg-white">
        <div className="mx-[15%] flex flex-col justify-center">
          <AnimatedTabs />
        </div>
      </div>
    </div>
  );
}
