"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "../static-components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { type LinkTypes } from "@/lib/zod/links"
import { GoLinkExternal } from "react-icons/go";
import CopyButton from "../copy-button"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<LinkTypes.Dashboard>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Original Url"/>,
    // header: ({ column }) => <div className="bg-red-600">Original Url</div>,
    cell: ({ row }) => (
      <div className="w-[300px] truncate">
        <a href={row.getValue("originalUrl")} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex flex-row items-center gap-2 font-mono">
          {row.getValue("originalUrl")}
          <GoLinkExternal className="h-4 w-4"/>
        </a>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "shortUrl",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Shortened Url" />,
    cell: ({ row }) => (
      <div className="flex space-x-1 items-center">
        <span className="max-w-[500px] truncate font-mono font-normal text-xs text-primary bg-muted rounded px-2 py-2">
          {row.getValue("shortUrl")}
        </span>
        {/* <Button className="max-w-[500px] truncate font-mono font-normal text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">{row.getValue("shortUrl")}</Button> */}
        <CopyButton className="h-6 w-6" textToCopy={row.getValue("shortUrl")} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "linkClicks",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Link Clicks" />,
    cell: ({ row }) => <div className="w-[80px] font-mono">{row.getValue("linkClicks")}</div>,
  },
  {
    accessorKey: "qrClicks",
    header: ({ column }) => <DataTableColumnHeader column={column} title="QR Clicks" />,
    cell: ({ row }) => <div className="w-[80px] font-mono">{row.getValue("qrClicks")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />
  },
]
