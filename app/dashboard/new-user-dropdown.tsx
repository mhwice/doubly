"use client";

import { logout } from "@/actions/logout"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, House, LogOut, Settings2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition } from "react"

interface DropdownProps {
  image: string | undefined | null,
  name: string,
  email: string
}

export function UserNav({ image, name, email }: DropdownProps) {

  const router = useRouter();

  function handleOnLogoutClick() {
    startTransition(async () => {
      await logout().then((data) => {
        console.log("something went wrong", data.error);
      });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-8 w-8 rounded-full focus:outline-none focus:ring-0 shadow-none">
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
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/")}><House className="mr-1" />Homepage</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/learn-more")}><BookOpen className="mr-1" />Learn More</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}><Settings2 className="mr-1" />Preferences</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOnLogoutClick}><LogOut className="mr-1" />Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
