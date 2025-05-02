import { DatabaseLogo } from "@/app/(marketing)/DatabaseLogo";
import { cn } from "@/lib/utils";
// import { Poppins } from "next/font/google";
import { Geist } from "next/font/google";
import Image from "next/image";

const font = Geist({
  subsets: ["latin"],
  weight: ["400"]
});


interface HeaderProps {
  label: string;
}

export const Header = ({label}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-10 items-center justify-center pb-5">
      <Image
          src="/logo.svg"
          alt="logo"
          width="80"
          height="80"
          priority />
        {/* <DatabaseLogo className="w-32"/> */}
      {/* <h1 className={cn("text-4xl font-black text-vprimary", font.className)}>{label}</h1> */}
      <h1 className="text-3xl font-semibold text-vprimary">{label}</h1>
      {/* <p className="text-muted-foreground text-sm">{label}</p> */}
    </div>
  );
}
