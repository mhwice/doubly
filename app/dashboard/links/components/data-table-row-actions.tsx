"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { type LinkTypes } from "@/lib/zod/links";
import { useRouter } from "next/navigation"
import { useCurrentFilters } from "../../filters-context"

interface DataTableRowActionsProps {
  row: Row<LinkTypes.Dashboard>,
  onEditClick: (link: LinkTypes.Dashboard) => void,
  onDeleteClick: (link: LinkTypes.Dashboard) => void,
  onViewQRClick: (link: LinkTypes.Dashboard) => void,
}

export function DataTableRowActions({ row, onEditClick, onDeleteClick, onViewQRClick }: DataTableRowActionsProps) {

  const { setFilters } = useCurrentFilters();
  const router = useRouter();

  const onCopyClicked = () => {
    const { shortUrl } = row.original;
    navigator.clipboard.writeText(shortUrl);
  }

  const viewAnalytics = () => {
    const { shortUrl } = row.original;
    setFilters([['shortUrl', shortUrl]]);
    router.push('/dashboard/analytics');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="text-vprimary"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] border-vborder">
        <DropdownMenuItem className="py-3 font-normal text-sm text-vsecondary" onClick={() => onEditClick(row.original)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="py-3 font-normal text-sm text-vsecondary" onClick={() => onViewQRClick(row.original)}>View QR Code</DropdownMenuItem>
        <DropdownMenuItem className="py-3 font-normal text-sm text-vsecondary" onClick={onCopyClicked}>Copy Short Url</DropdownMenuItem>
        <DropdownMenuItem className="py-3 font-normal text-sm text-vsecondary" onClick={viewAnalytics}>View Analytics</DropdownMenuItem>
        <DropdownMenuSeparator className="bg-vborder"/>
        <DropdownMenuItem className="py-3 font-normal text-sm text-vsecondary" onClick={() => onDeleteClick(row.original)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
