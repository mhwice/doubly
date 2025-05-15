"use client";

import { AnimatedTabs } from "./animated-tabs";
import { UserNav } from "./new-user-dropdown";
import Image from "next/image";

interface NavbarProps {
  image: string | undefined | null,
  name: string,
  email: string
}

export function VercelNavbar({ image, name, email }: NavbarProps) {
  return (
    <div style={{ display: 'contents' }} className="flex flex-col w-full bg-white">
      <div className="h-14 w-full bg-background transition-all duration-300 ease-in-out mt-5">
        {/* <div className="flex align-self justify-between items-center mx-[15%]"> */}
        <div className="flex align-self justify-between items-center max-w-7xl mx-auto px-3 md:px-5 xl:px-10">
          {/* <DatabaseLogo className="w-28 md:w-32" /> */}
          <Image
              src="/logo-with-text.svg"
              alt="logo"
              width="100"
              height="100"
              priority />
          {/* <DropdownUserProfile email={email} /> */}
          <UserNav email={email} name={name} image={image} />
        </div>
      </div>

      <div className="sticky top-0 py-[5px] w-full border-b border-vborder shadow-none z-50 transition-all duration-300 ease-in-out bg-white">
        {/* <div className="mx-[15%] flex flex-col justify-center"> */}
        <div className="max-w-7xl mx-auto px-3 md:px-5 xl:px-10 flex flex-col justify-center">
          <AnimatedTabs />
        </div>
      </div>
    </div>
  );
}
