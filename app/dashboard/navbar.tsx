"use client"

// import { cn } from "@/lib/utils"
// import useScroll from "../(marketing)/lib/use-scroll"

// export function VercelNavbar() {
//   const scrolled = useScroll(64);

//   return (
//     <div className="flex flex-col w-full">
//       {/* Primary Navigation - Non-sticky */}
//       <div className={
//         cn("h-16 w-full bg-background border-b transition-all duration-300 ease-in-out bg-red-100"
//       )}>
//       </div>

//       {/* Secondary Navigation - Sticky */}
//       <div className={cn(
//         "h-14 w-full bg-background border-b transition-all duration-300 ease-in-out z-50 bg-blue-100",
//         scrolled ? "fixed top-0 left-0 shadow-sm" : "",
//       )}>
//       </div>
//     </div>
//   )
// }

// export function VercelNavbar() {
//   return (
//     <div>
//       <div style={{ display: 'contents' }} className="flex flex-col w-full">
//         {/* Primary Navigation - Non-sticky */}
//         <div className="h-16 w-full bg-red-100 border-b">
//           {/* Primary content here */}
//         </div>

//         {/* Secondary Navigation - Sticky using CSS sticky */}
//         <div className="sticky top-0 h-14 w-full bg-blue-100 border-b shadow-sm z-50">
//           {/* Secondary content here */}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client"

import { cn } from "@/lib/utils"
import useScroll from "../(marketing)/lib/use-scroll"
import { AnimatedTabs } from "./animated-tabs";
import { DatabaseLogo } from "../landing/DatabaseLogo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VercelNavbar() {
  const scrolled = useScroll(64);

  return (
    <div className="flex flex-col w-full">
      {/* Primary Navigation - Non-sticky */}
      <div className="h-16 w-full bg-background transition-all duration-300 ease-in-out flex align-self justify-between items-center px-5">

        {/* Content for primary navigation */}
        <DatabaseLogo className="w-28 md:w-32"/>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Secondary Navigation - Sticky */}
      <div className={cn(
        "h-11 w-full pt-2 px-5 bg-background border-b transition-all duration-300 ease-in-out z-50",
        scrolled ? "fixed top-0 left-0 shadow-sm" : "",
      )}>
        <AnimatedTabs />
      </div>

      {/* Placeholder to maintain layout */}
      {scrolled && <div className="h-11"/>}
    </div>
  )
}
