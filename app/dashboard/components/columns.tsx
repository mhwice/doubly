"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "../static-components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { type LinkTypes } from "@/lib/zod/links"

export const columns: ColumnDef<LinkTypes.DTO>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "originalUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="originalUrl" />
    ),
    cell: ({ row }) => <div className="w-[150px] truncate">{row.getValue("originalUrl")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "shortUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="shortUrl" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.shortUrl)

      return (
        <div className="flex space-x-1">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("shortUrl")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "linkClicks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="linkClicks" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("linkClicks")}</div>,
    // cell: ({ row }) => {
    //   // const status = statuses.find(
    //   //   (status) => status.value === row.getValue("linkClicks")
    //   // )

    //   // if (!status) {
    //   //   return null
    //   // }

    //   return (
    //     <div className="flex w-[100px] items-center">
    //       {/* {status.icon && (
    //         <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
    //       )} */}
    //       <span>{status.label}</span>
    //     </div>
    //   )
    // },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id))
    // },
  },
  {
    accessorKey: "qrClicks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="qrClicks" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("qrClicks")}</div>,
    // cell: ({ row }) => {
    //   const priority = priorities.find(
    //     (priority) => priority.value === row.getValue("qrClicks")
    //   )

    //   if (!priority) {
    //     return null
    //   }

    //   return (
    //     <div className="flex items-center">
    //       {priority.icon && (
    //         <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
    //       )}
    //       <span>{priority.label}</span>
    //     </div>
    //   )
    // },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id))
    // },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />
  },
]
