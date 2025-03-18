export default function AuthLayout({ children }: {children: React.ReactNode}) {
  return (
    <div className="h-full flex items-center justify-center absolute top-0 w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(216,216,216,0.8),rgba(255,255,255,0))]">
      {children}
    </div>
  );
}
