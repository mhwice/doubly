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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import type { LinkDTOSchemaType } from "@/data-access/urls"
import { useState } from "react"

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  linkData: LinkDTOSchemaType | undefined
}

export function EditLinkModal({ title, description, isOpen, onOpenChange, linkData }: ModalProps) {

  const [isPasswordToggleOn, setIsPasswordToggledOn] = useState(false);
  const [isExpirationToggleOn, setIsExpirationToggledOn] = useState(false);
  const [date, setDate] = useState<Date>()

  const handlePasswordToggleChange = (checked: boolean) => {
    setIsPasswordToggledOn(checked);
  }

  const handleExpirationToggleChange = (checked: boolean) => {
    setIsExpirationToggledOn(checked);
  }

  const handleButtonClick = () => {
    console.log("save or edit link")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="name" className="text-left">Original Link</Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input id="name" defaultValue={linkData?.originalUrl || ""} className="col-span-4" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-feature" className="cursor-pointer">
              Passowrd Protected
            </Label>
            <Switch id="enable-feature" checked={isPasswordToggleOn} onCheckedChange={handlePasswordToggleChange} />
          </div>
          { isPasswordToggleOn && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Input id="username" defaultValue="" className="col-span-4" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="enable-feature" className="cursor-pointer">
              Link Expiration Date
            </Label>
            <Switch id="enable-feature" checked={isExpirationToggleOn} onCheckedChange={handleExpirationToggleChange} />
          </div>
          { isExpirationToggleOn && (
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="default" onClick={handleButtonClick}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
