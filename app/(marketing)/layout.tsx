import { Inter } from "next/font/google";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className={`${inter.className} min-h-screen scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}>
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}

