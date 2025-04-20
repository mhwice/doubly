import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronDown, ChevronsUpDown, ChevronUp, EyeOff } from "lucide-react"
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      // size="sm"
      onClick={() => {
        column.toggleSorting(undefined);
      }}
      className={cn(
        "py-0 px-0 h-7 hover:bg-transparent flex gap-2 items-center justify-start w-full",
        className
      )}
    >
      <span>{title}</span>
      <span className="flex flex-col">
        <TiArrowSortedUp
          className={cn(
            "-mb-1 h-3 w-3",
            column.getIsSorted() === "asc"
              ? "text-vprimary"
              : "text-vsecondary"
          )}
        />
        <TiArrowSortedDown
          className={cn(
            "-mt-1 h-3 w-3",
            column.getIsSorted() === "desc"
              ? "text-vprimary"
              : "text-vsecondary"
          )}
        />
      </span>
    </Button>
  );
  // if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>

  // const handleOnClick = () => {
  //   if (column.getIsSorted() === "desc") {
  //     column.toggleSorting(false);
  //   } else if (column.getIsSorted() === "asc") {
  //     column.toggleSorting(true);
  //   } else {
  //     column.toggleSorting(true);
  //   }

  // }

  // return (
  //   <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent" onClick={handleOnClick}>
  //     <span>{title}</span>
  //     {/* {column.getIsSorted() === "desc" ? (<ArrowDown />) : column.getIsSorted() === "asc" ? (<ArrowUp />) : (<ChevronsUpDown />)} */}
  //     <span className="flex flex-col">
  //       <ChevronUp
  //         className={cn(
  //           "-mb-0.5 h-3 w-3",
  //           column.getIsSorted() === "asc"
  //             ? "text-accent-foreground"
  //             : "text-muted-foreground"
  //         )}
  //       />
  //       <ChevronDown
  //         className={cn(
  //           "-mt-0.5 h-3 w-3",
  //           column.getIsSorted() === "desc"
  //             ? "text-accent-foreground"
  //             : "text-muted-foreground"
  //         )}
  //       />
  //     </span>
  //   </Button>
  // );

  // return (
  //   <div className={cn("flex items-center space-x-2", className)}>
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
  //           <span>{title}</span>
  //           {column.getIsSorted() === "desc" ? (<ArrowDown />) : column.getIsSorted() === "asc" ? (<ArrowUp />) : (<ChevronsUpDown />)}
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent align="start">
  //         <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
  //           <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
  //           Asc
  //         </DropdownMenuItem>
  //         <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
  //           <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
  //           Desc
  //         </DropdownMenuItem>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
  //           <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
  //           Hide
  //         </DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   </div>
  // )
}
