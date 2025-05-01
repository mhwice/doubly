import { Column } from "@tanstack/react-table"
import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>;

  return (
    <div className="">
    <Button
      variant="ghost"
      onClick={() => { column.toggleSorting(undefined) }}
      className={cn("py-0 px-0 h-7 hover:bg-transparent flex gap-2 items-center justify-start w-full hover:text-vsecondary", className)}
    >
      <span>{title}</span>
      <div className="flex flex-col ">
        <ChevronUp strokeWidth={1.75} style={{ width: 20, height: 10 }} className={`-mb-[1.5px] ${column.getIsSorted() === "asc" ? "text-vsecondary" : "text-[#b0b0b0]"}`}/>
        <ChevronDown strokeWidth={1.75} style={{ width: 20, height: 10 }} className={`-mt-[1.5px] ${column.getIsSorted() === "desc" ? "text-vsecondary" : "text-[#b0b0b0]"}`}/>
      </div>
    </Button>
    </div>
  );
}
