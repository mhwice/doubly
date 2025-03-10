import { cn } from "@/lib/utils";
// import { Poppins } from "next/font/google";
import { Geist } from "next/font/google";

const font = Geist({
  subsets: ["latin"],
  weight: ["400"]
});


interface HeaderProps {
  label: string;
}

export const Header = ({label}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", font.className)}>{label}</h1>
      {/* <p className="text-muted-foreground text-sm">{label}</p> */}
    </div>
  );
}
