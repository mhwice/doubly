"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { startTransition } from "react";

export function LogoutButton() {

  function handleOnLogoutClick() {
    startTransition(async () => {
      await logout().then((data) => {
        // console.log("something went wrong", data.error);
      });
    });
  }

  return (
    <Button onClick={handleOnLogoutClick}>Logout</Button>
  );
}
