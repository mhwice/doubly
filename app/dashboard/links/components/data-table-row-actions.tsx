"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QRCodeModal } from "@/components/qr-modal"

import { useState } from "react";
import { DeleteLinkModal } from "@/components/delete-link-modal"
import { EditLinkModal } from "@/components/edit-link-modal"
import { type LinkTypes } from "@/lib/zod/links";
import { CustomDialog } from "@/components/custom-dialog"
import { EditLinkForm } from "@/components/edit-link-form"

// interface DataTableRowActionsProps<TData> {
//   row: Row<TData>
// }

interface DataTableRowActionsProps {
  row: Row<LinkTypes.Dashboard>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {

  const [showQRModal, setShowQRModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [url, setUrl] = useState("");
  const [id, setId] = useState<number | undefined>(undefined);

  const onViewQRClicked = () => {
    const { shortUrl } = row.original;
    setUrl(shortUrl);
    setShowQRModal(true);
  }

  const onDeleteClicked = () => {
    const { id } = row.original;
    setId(id);
    setShowDeleteModal(true);
  }

  const onEditClicked = () => {
    const { id, originalUrl } = row.original;
    setId(id);
    setUrl(originalUrl);
    setShowEditModal(true);
  }

  const onCopyClicked = () => {
    const { shortUrl } = row.original;
    navigator.clipboard.writeText(shortUrl);
  }

  return (
    <>
      <QRCodeModal
        isOpen={showQRModal}
        onOpenChange={setShowQRModal}
        shortUrl={url}
        code="123456"
      />
      <DeleteLinkModal isOpen={showDeleteModal} onOpenChange={setShowDeleteModal} linkIds={[row.original.id]}/>
      {/* <EditLinkModal
        title="Edit link"
        description="What would you like to change?"
        isOpen={showEditModal}
        onOpenChange={setShowEditModal}
        linkData={row.original}
      /> */}
      <CustomDialog
        title="Edit link"
        description="Enter a new url"
        isOpen={showEditModal}
        onOpenChange={setShowEditModal}
      >
        <EditLinkForm setIsOpen={setShowEditModal} link={url} isEditing id={id} />
      </CustomDialog>
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
          <DropdownMenuItem className="py-3 font-normal text-sm text-vsecondary" onClick={onEditClicked}>Edit</DropdownMenuItem>
          <DropdownMenuItem className="py-3 font-normal text-sm text-vsecondary" onClick={onViewQRClicked}>View QR Code</DropdownMenuItem>
          <DropdownMenuItem className="py-3 font-normal text-sm text-vsecondary" onClick={onCopyClicked}>Copy Short Url</DropdownMenuItem>
          <DropdownMenuSeparator className="bg-vborder"/>
          <DropdownMenuItem className="py-3 font-normal text-sm text-vsecondary" onClick={onDeleteClicked}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
