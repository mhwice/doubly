import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomDialogProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode
}

export function CustomDialog({ title, description, isOpen, onOpenChange, children }: CustomDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-[#dedede] p-0 overflow-hidden">
        <DialogHeader className="px-6 pb-2">
          <DialogTitle className="text-vprimary">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-vsecondary">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="px-6 py-5">{children}</div>
        {/* <DialogFooter className="bg-red-200 absolute bottom-0 right-0 left-0 h-10"> */}
        <DialogFooter className="flex justify-between border-t border-vborder bg-[#f4f4f4] p-4 px-6">
          Hello
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
