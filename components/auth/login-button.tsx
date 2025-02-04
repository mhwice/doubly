"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode,
  mode?: "modal" | "redirect",
  asChild?: boolean
}

export const LoginButton = ({ children, mode = "redirect", asChild }: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  }

  if (mode === "modal") {
    return (
      <span>TODO - implement modal!</span>
    );
  }

  return (
    <span onClick={onClick} className="cursor-pointer">{children}</span>
  );
};


/*

Questions
- why "use client"?
- I don't understand the props for this component...
- the TS interface is a bit confusing. whats the ? mean? optional keys?

- the useRouter hooks seems intuitive enough

*/
