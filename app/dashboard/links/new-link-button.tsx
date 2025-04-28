"use client";

import { CreateLinkModal } from "@/components/create-link-modal";
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
      <Button className="whitespace-nowrap shadow-none bg-vprimary" onClick={handleOnClick}>
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
      {/* <CustomDialog
        title="Create a new link"
        description="Enter the url of something you'd like to track"
        isOpen={true}//{isModalOpen} // testing
        onOpenChange={setIsModalOpen}
      >
        <EditLinkForm setIsOpen={setIsModalOpen} isEditing={false} />
      </CustomDialog> */}

      {/* <VercelDialog
        title="Create a new link"
        description="Enter the url of something you'd like to track"
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        footer={(
          <div className="flex flex-row justify-between w-full">
            <Button size="lg" variant="flat">Cancel</Button>
            <Button size="lg" variant="defaultFlat">Create</Button>
          </div>
        )}
      >
        <EditLinkForm setIsOpen={setIsModalOpen} isEditing={false} />
      </VercelDialog> */}

      <CreateLinkModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}/>
    </>
  );
}
