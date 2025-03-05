import Navbar from "./_components/deprecated-navbar";

export default function ProtectedLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
      <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center r">
        <Navbar />
        {children}
      </div>
  );
}
