import { Geist } from "next/font/google";
import Image from "next/image";

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
      <h1 className="text-3xl font-semibold text-vprimary">{label}</h1>
    </div>
  );
}
