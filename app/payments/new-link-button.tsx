"use client";

import { createURL } from "@/actions/create-url";
import { EditLinkModal } from "@/components/edit-link-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function NewLinkButton() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOnClick = () => {
    setIsModalOpen(true);
  }

  // For now hold off on this, as I might restructure the modal to use a passed in form
  const handleOnModalButtonClick = async (url: string, shortUrl: string, code: string, userId: string) => {
    await createURL(url, shortUrl, code, userId);
  }

  return (
    <>
      <Button onClick={handleOnClick}>New Link</Button>
      <EditLinkModal
        title="Create a new link"
        description="Enter the url of something you'd like to track"
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        linkData={undefined}
      />
    </>
  );
}
