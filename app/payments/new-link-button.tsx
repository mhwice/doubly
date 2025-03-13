"use client";

import { EditLinkModal } from "@/components/edit-link-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function NewLinkButton() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOnClick = () => {
    setIsModalOpen(true);
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
