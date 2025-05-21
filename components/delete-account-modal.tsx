"use client";

import { useState } from "react";
import { BaseModal } from "./base-modal";
import { deleteAccount } from "@/actions/delete-account";
import { useRouter } from "next/navigation";


interface CustomDialogProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteAccountModal({ isOpen, onOpenChange }: CustomDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleOnDelete = async () => {
    setIsPending(true);
    try {

      const response = await deleteAccount();
      // await authClient.deleteUser({callbackURL: "/"});
      if (response.success && response.data) {
        localStorage.clear();
        sessionStorage.clear();
        /*
        TODO
        i am not deleting the better auth cookies
        handle this eventually...
        */
        router.push("/");
      }
    } catch (error) {

    } finally {
      setIsPending(false);
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Final Warning"
      description="You will delete all link and click data associated with your account. All short links will stop working. This action is unreversable."
      onSubmit={handleOnDelete}
      isPending={isPending}
      submitLabel="Delete"
      isDelete={true}
    />
  );
}
