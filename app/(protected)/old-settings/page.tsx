"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card";

export default function SettingsPage() {

  const onClick = () => {
    console.log("click")
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold">Settings</p>
      </CardHeader>
      <CardContent>
        <Button onClick={onClick}>Update name</Button>
      </CardContent>
    </Card>
  );
}
