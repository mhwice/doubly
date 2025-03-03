"use client";

import { UserInfo } from "@/components/deprecated-user-info";
import { useCurrentUser } from "@/hooks/deprecated-use-current-user";

export default function ServerPage() {
  const user = useCurrentUser();
  return (
    <UserInfo user={user} label="Client component" />
  );
}
