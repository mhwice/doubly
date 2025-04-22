"use client";

import { DeleteAccountModal } from "@/components/delete-account-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function DeleteAccountCard() {

  const [showModal, setShowModal] = useState(false);

  function onDeleteClicked() {
    setShowModal(true);
  }

  return (
    <>
      <DeleteAccountModal isOpen={showModal} onOpenChange={setShowModal} />
      <Card className="w-full max-w-3xl border-red-100 overflow-hidden shadow-none rounded-[var(--bradius)]">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-vprimary">Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-vsecondary text-sm">
            Permanently remove your account and all of its contents from
            the Database platform. This action is not reversible, so please continue
            with caution.
          </p>
        </CardContent>
        <CardFooter className="bg-red-50 p-3 flex justify-end border-t border-red-100">
          <Button variant="destructiveFlat" className="bg-red-600 hover:bg-red-700" onClick={onDeleteClicked}>
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
