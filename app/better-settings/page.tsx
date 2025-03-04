import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export default async function BetterSettings() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div>
      {JSON.stringify(session?.session)}
      <br />
      {JSON.stringify(session?.user)}
    </div>
  );
}
