import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Navbar from "./_components/navbar";

export default async function ProtectedLayout({ children }: Readonly<{children: React.ReactNode}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-slate-200">
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
}
