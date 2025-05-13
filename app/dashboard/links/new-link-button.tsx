"use client";

import { CreateLinkModal } from "@/components/create-link-modal";
import { Button } from "@/components/doubly/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function NewLinkButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}><Plus className="h-4 w-4" />Create Link</Button>
      <CreateLinkModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}/>
    </>
  );
}
