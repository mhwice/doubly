"use client";

// import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const user = useCurrentUser();

  return (
    <div className="bg-white p-10 rounded-xl">
      <button onClick={() => signOut()} type="submit">Sign out</button>
    </div>
  );
}
