"use client";

import { RefreshCw } from "lucide-react";
import { useCurrentDate } from "@/app/dashboard/date-context";
import { toast } from "sonner";
import { Button } from "./doubly/ui/button";

export const RefreshButton = ({ isLoading }: { isLoading: boolean }) => {
  const { setDate } = useCurrentDate();

  const handleOnClick = () => {
    const newNow = new Date();
    setDate(newNow);
    // toast("Refresh completed", {
    //   description: `Showing all data up to ${newNow.toDateString()}`,
    // })
  };

  return (
    <Button
      loading={isLoading}
      onClick={handleOnClick}
      variant="outline"
    >
      {!isLoading && <RefreshCw strokeWidth={1.75} className="text-xprimary" />} Refresh
    </Button>
  );
};
