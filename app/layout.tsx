import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Inter, Roboto, Montserrat, Lato, Fira_Sans, Raleway, Poppins, DM_Sans, Rubik, Geist } from 'next/font/google';

// const font = Roboto({ weight: "400", subsets: ['latin'], variable: '--font-inter' });
// const font = Inter({ subsets: ['latin'], variable: '--font-inter' });
// const font = Montserrat({ subsets: ['latin'], variable: '--font-inter' });
// const font = Lato({ weight: "400", subsets: ['latin'], variable: '--font-inter' });
// const font = Fira_Sans({ weight: "400", subsets: ['latin'], variable: '--font-inter' });
// const font = Raleway({ weight: "400", subsets: ['latin'], variable: '--font-inter' });
// const font = Poppins({ weight: "400", subsets: ['latin'], variable: '--font-inter' });
// const font = DM_Sans({ weight: "400", subsets: ['latin'], variable: '--font-inter' });
// const font = Geist({ weight: "400", subsets: ['latin'], variable: '--font-inter' });
// const font = Rubik({ weight: "400", subsets: ["latin"], variable: '--font-inter' });

// const font = Geist({ subsets: ['latin'], variable: '--font-inter'});

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',            // ensures fast FOUT recovery
  variable: '--font-inter',   // if you want to use the CSS var in Tailwind
});

export const metadata: Metadata = {
  title: "Doubly: Links with superpowers",
  description: "Doubly is a modern link shortening and tracking service, built for scale and ease-of-use.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.ico" sizes="any" />
      <link rel="icon" href="/favicon-96x96.png" sizes="32x32" />
      <link rel="mask-icon" href="/favicon.svg" color="#000000" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <body className={`${geist.className} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
