import { getSession } from "@/lib/get-session";
import { VercelNavbar } from "./navbar";
import { redirect } from "next/navigation";
import { DateProvider } from "./date-context";
import { Footer } from "./footer";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

  const session = await getSession();
  if (!session) redirect("/");
  const { email, name, image } = session.user;

  const now = new Date();
  return (
    <div className="flex flex-col min-h-screen">
      <VercelNavbar email={email} name={name} image={image} />
      <main className="flex-1 bg-[var(--dashboard-bg)]">
        <DateProvider date={now}>
          {children}
        </DateProvider>
      </main>
      <Footer />
    </div>
  )
}
