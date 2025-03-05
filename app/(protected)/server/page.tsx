import { UserInfo } from "@/components/user-info";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export default async function ServerPage() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <UserInfo label="Server component" user={session?.user} />
  );
}
