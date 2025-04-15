import { getSession } from "@/lib/get-session";
import { VercelNavbar } from "./navbar";
import { redirect } from "next/navigation";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

  const session = await getSession();
  if (!session) redirect("/");
  const email = session.user.email;

  return (
    <>
      <VercelNavbar email={email} />
      {children}
    </>
  )
}
