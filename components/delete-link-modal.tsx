import { deleteURL } from "@/actions/delete-url";
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
import { LinkDTOSchemaType } from "@/data-access/urls";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  linkData: LinkDTOSchemaType
}

export function DeleteLinkModal({ isOpen, onOpenChange, linkData }: ModalProps) {

  const handleOnDelete = async () => {
    // call a deleteLink action
    await deleteURL(linkData.id);
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
