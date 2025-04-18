"use client";

import { createLink } from "@/actions/safe-create-link";
import { CustomDialog } from "@/components/custom-dialog";
import { EditLinkForm } from "@/components/edit-link-form";
import { EditLinkModal } from "@/components/edit-link-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function NewLinkButton() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOnClick = () => {
    setIsModalOpen(true);
  }

  // For now hold off on this, as I might restructure the modal to use a passed in form
  const handleOnModalButtonClick = async (url: string, shortUrl: string, code: string, userId: string) => {
  //   await createURL(url, shortUrl, code, userId);
  }

  return (
    <>
      <Button className="whitespace-nowrap shadow-none" onClick={handleOnClick}>
        <Plus className="h-4 w-4 mr-1" />
        Create Link
      </Button>
      {/* <EditLinkModal
        title="Create a new link"
        description="Enter the url of something you'd like to track"
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        linkData={undefined}
      /> */}
      <CustomDialog
        title="Create a new link"
        description="Enter the url of something you'd like to track"
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <EditLinkForm setIsOpen={setIsModalOpen} isEditing={false} />
      </CustomDialog>
    </>
  );
}
