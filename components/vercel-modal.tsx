import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomDialogProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode
  footer: React.ReactNode
}

export function VercelDialog({ title, description, isOpen, onOpenChange, children, footer }: CustomDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-[#dedede] p-0 overflow-hidden sm:rounded-xl shadow-custom">
        <DialogHeader className="px-6 pb-2 pt-7">
          <DialogTitle className="text-vprimary text-2xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-vsecondary">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="px-6 py-4">{children}</div>
        <DialogFooter className="border-t border-vborder bg-[var(--dashboard-bg)] p-4 px-6">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
