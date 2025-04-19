import { getSession } from "@/lib/get-session";
import { Hero } from "./hero";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex flex-col overflow-hidden">
      <Hero isLoggedIn={!!session?.user} />
    </main>
  )
}
