"use client";

import { settings } from "@/actions/deprecated-settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useTransition } from "react";

export default function SettingsPage() {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      settings({
        name: "new name"
      }).then(() => {
        update();
      })
    });
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold">Settings</p>
      </CardHeader>
      <CardContent>
        <Button disabled={isPending} onClick={onClick}>Update name</Button>
      </CardContent>
    </Card>
  );
}
