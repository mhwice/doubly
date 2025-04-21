"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "../static-components/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { type LinkTypes } from "@/lib/zod/links"
import { GoLinkExternal } from "react-icons/go";
import CopyButton from "../copy-button"
import { Button } from "@/components/ui/button"
import { IoCopyOutline } from "react-icons/io5"
import { BorderGlowButton } from "../border-glow-button"

export const columns: ColumnDef<LinkTypes.Dashboard>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div>
      <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
      />
      </div>
    ),
    cell: ({ row }) => (
      <div>
      <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "originalUrl",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Original Url" className="text-vsecondary text-sm" />,
    // header: ({ column }) => <div className="bg-red-600">Original Url</div>,
    cell: ({ row }) => (
      // <div className="w-[300px] truncate">
        // <a href={row.getValue("originalUrl")} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex flex-row items-center gap-2 font-mono">
        //   {row.getValue("originalUrl")}
        //   <GoLinkExternal className="h-4 w-4"/>
        // </a>
      // </div>
      // <div className="max-w-[200px] overflow-hidden relative text-nowrap">
      //   <span className="url-overflow after:content-[''] after:absolute after:top-0 after:right-0 after:w-[30%] after:h-full after:pointer-events-none">
      //     <a href={row.getValue("originalUrl")} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex flex-row items-center gap-2 font-mono">
      //       <GoLinkExternal className="h-4 w-4"/>
      //       {row.getValue("originalUrl")}
      //     </a>
      //   </span>
      // </div>
      <div className="group max-w-[400px] overflow-hidden relative whitespace-nowrap">
        <a href={row.getValue("originalUrl")} target="_blank" rel="noopener noreferrer" className="url-overflow text-[#0168d6] inline-flex items-center gap-2 font-mono align-bottom">
          <GoLinkExternal className="h-4 w-4 flex-shrink-0"/>
          {cleanUrl(row.getValue("originalUrl"))}
        </a>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "shortUrl",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Shortened Url" className="text-vsecondary text-sm" />,
    cell: ({ row }) => (
      <div className="flex space-x-1 items-center">
        {/* <BorderGlowButton text={cleanUrl(row.getValue("shortUrl"))}/> */}
        <Button className="font-mono font-normal text-sm text-vsecondary" variant="ghost">{cleanUrl(row.getValue("shortUrl"))}</Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "linkClicks",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Link Clicks" className="text-vsecondary text-sm"/>,
    cell: ({ row }) => <div className="w-[80px] font-mono text-vsecondary">{row.getValue("linkClicks")}</div>,
  },
  {
    accessorKey: "qrClicks",
    header: ({ column }) => <DataTableColumnHeader column={column} title="QR Clicks" className="text-vsecondary text-sm"/>,
    cell: ({ row }) => <div className="w-[80px] font-mono text-vsecondary">{row.getValue("qrClicks")}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Interacted" className="text-vsecondary text-sm"/>,
    cell: ({ row }) => <div className="max-w-[200px] min-w-[150px] font-mono text-vsecondary">
      {(row.getValue("updatedAt") as Date).toDateString()}
    </div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />
  },
]

export function cleanUrl(url: string) {
  if (url.startsWith("https://")) {
    return url.substring(8);
  } else if (url.startsWith("http://")) {
    return url.substring(7);
  } else {
    return url;
  }
}
