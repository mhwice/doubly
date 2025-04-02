import { deleteLink } from "@/actions/safe-delete-link";
// import { useUser } from "@/app/dashboard/UserContext";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { type LinkTypes } from "@/lib/zod/links";
import { startTransition } from "react";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  linkData: LinkTypes.DTO
}

export function DeleteLinkModal({ isOpen, onOpenChange, linkData }: ModalProps) {

  // const { userId } = useUser();

  const handleOnDelete = async () => {
    // call a deleteLink action
    // IMPORTANT! this needs the user id as well.
    startTransition(async () => {
      const response = await deleteLink({ id: linkData.id });
      if (response) onOpenChange(false);
      else throw new Error("failed to delete");
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this link? This will delete all analytics as well.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="destructive" onClick={handleOnDelete}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
