import { getSession } from "@/lib/get-session";
import { VercelNavbar } from "./navbar";
import { redirect } from "next/navigation";
import { DateProvider } from "./date-context";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

  const session = await getSession();
  if (!session) redirect("/");
  const email = session.user.email;

  const now = new Date();
  return (
    <>
      <VercelNavbar email={email} />
      <DateProvider date={now}>
        {children}
      </DateProvider>
    </>
  )
}
