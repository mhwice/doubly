"use client";

import { useState } from "react";
import { BaseModal } from "./base-modal";
import { deleteLink } from "@/actions/delete-link";
import { useSWRConfig } from 'swr'
import { useCurrentDate } from "@/app/dashboard/date-context";

interface CustomDialogProps {
  onLinkDelete: () => void;
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  ids: number[];
}

export function DeleteLinkModal({ onLinkDelete, isOpen, onOpenChange, ids }: CustomDialogProps) {
  // const [isPending, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useSWRConfig();
  const { date: now, setDate } = useCurrentDate();

  const handleOnDelete = async () => {
    // startTransition(async () => {

    // });
    setIsPending(true);
    try {
      const response = await deleteLink(ids);
      if (response && response.success) {
        // const params = new URLSearchParams();
        // params.append("dateEnd", now.toISOString());
        // const url = `/api/links?${params.toString()}`;
        // mutate(url);
        const newNow = new Date();
        setDate(newNow);

        onLinkDelete();
        onOpenChange(false);
      }
    } catch (error) {
      // catch error and report back to user
    } finally {
      setIsPending(false);
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Delete Link"
      description={`Permanently delete ${ids.length === 1 ? "this link" : `these ${ids.length} links`} and all associated analytics data. This action is non-reversible.`}
      onSubmit={handleOnDelete}
      isPending={isPending}
      submitLabel="Delete"
      isDelete={true}
    />
  );
}
