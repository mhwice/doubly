import { VercelNavbar } from "./navbar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <VercelNavbar />
      {children}
    </div>
  )
}
