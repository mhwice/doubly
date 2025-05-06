"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useCurrentDate } from "@/app/dashboard/date-context";
import { RiLoader2Fill } from "@remixicon/react";
import { toast } from "sonner";

export const RefreshButton = ({ isLoading }: { isLoading: boolean }) => {
  const { setDate } = useCurrentDate();

  const handleOnClick = () => {
    const newNow = new Date();
    setDate(newNow);
    // toast("Refresh completed", {
    //   description: `Showing all data up to ${newNow.toDateString()}`,
    // })
  }

  return (
    <Button disabled={isLoading} onClick={handleOnClick} variant="flat" className="text-vprimary font-normal">
      {isLoading ?
        <><RiLoader2Fill className="size-4 shrink-0 animate-spin" aria-hidden="true"/>Refresh</>  :
        <><RefreshCw strokeWidth={1.75} className="text-vprimary"/>Refresh</>
      }
    </Button>
  );
}
