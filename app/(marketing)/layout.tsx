import { Inter } from "next/font/google";
import { Navbar } from "./navbar";
import { Footer } from "./dashboard-footer";
import { getSession } from "@/lib/get-session";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  return (
    <>
      <div className={`${inter.className} min-h-screen scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}>
        <Navbar isLoggedIn={!!session?.user} />
        {children}
        <Footer />
      </div>
    </>
  );
}

