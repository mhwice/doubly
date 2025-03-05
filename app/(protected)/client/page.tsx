"use client";

import { UserInfo } from "@/components/user-info";
import { authClient } from "@/utils/auth-client";

export default function ServerPage() {
  const { data: session } = authClient.useSession();
  return <UserInfo user={session?.user} label="Client component" />;
}
