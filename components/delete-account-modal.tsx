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
import { startTransition } from "react";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountModal({ isOpen, onOpenChange }: ModalProps) {

  const handleOnDelete = async () => {
    startTransition(async () => {

    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Final Warning</DialogTitle>
          <DialogDescription>
            You will delete all link and click data associated with your account. All short links will stop working.
            This action is unreversable.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="destructiveFlat" onClick={handleOnDelete}>
              Delete Account
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
