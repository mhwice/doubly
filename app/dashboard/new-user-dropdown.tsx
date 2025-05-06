"use client";

import { logout } from "@/actions/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/utils/auth-client";
import { sleep } from "@/utils/helper";
import { BookOpen, House, LogOut, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

interface DropdownProps {
  image: string | undefined | null;
  name: string;
  email: string;
}

export function UserNav({ image, name, email }: DropdownProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full focus:outline-none focus:ring-0 shadow-none"
        >
          <span className="absolute inset-0 rounded-full hover:ring-4 hover:ring-gray-100">
            <Avatar className="h-8 w-8">
              <AvatarImage src={image || ""} alt={name} />
              <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-yellow-500"></AvatarFallback>
            </Avatar>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2 py-2">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {email}
              {/* really.long.email.address@someemailprovider.net */}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex justify-between py-3 font-normal text-sm text-[#666666]" onClick={() => router.push("/")}>
            Homepage
            <House className="mr-1" />
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            className="flex justify-between py-3 font-normal text-sm text-[#666666]"
            onClick={() => router.push("/learn-more")}
          >
            Learn More
            <BookOpen className="mr-1" />
          </DropdownMenuItem> */}
          <DropdownMenuItem
            className="flex justify-between py-3 font-normal text-sm text-[#666666]"
            onClick={() => router.push("/dashboard/settings")}
          >
            Account Settings
            <Settings2 className="mr-1" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => {
          // e.preventDefault();
          handleLogout();
        }} className="flex justify-between py-3 font-normal text-sm text-[#666666]">
          Logout
          <LogOut className="mr-1" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
