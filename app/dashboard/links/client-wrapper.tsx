"use client";

import { Dashboard, ServerResponseLinksGetAllSchema } from "@/lib/zod/links";
import { DataTable } from "./components/data-table";
import { cleanUrl } from "./components/columns";
import { useCurrentDate } from "../date-context";
import useSWR from "swr";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./components/data-table-row-actions";
import { DataTableColumnHeader } from "./static-components/data-table-column-header";
import { SquareArrowOutUpRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { EditLinkModal } from "@/components/edit-link-modal";
import { QRCodeModal } from "@/components/qr-modal";
import { DeleteLinkModal } from "@/components/delete-link-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ClientWrapper() {

  const { date: now } = useCurrentDate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeLink, setActiveLink] = useState<Dashboard>();

  const handleEditClick = (clickedLink: Dashboard) => {
    setActiveLink(clickedLink);
    setShowEditModal(true);
  }

  const handleDeleteClick = (clickedLink: Dashboard) => {
    setActiveLink(clickedLink);
    setShowDeleteModal(true);
  }

  const handleQRClick = (clickedLink: Dashboard) => {
    setActiveLink(clickedLink);
    setShowQRModal(true);
  }

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    const validated = ServerResponseLinksGetAllSchema.safeParse(jsonResponse);
    if (!validated.success) console.log(validated.error)
    if (!validated.success) throw new Error("failed to validate api response");
    if (!validated.data.success) throw new Error(validated.data.error);
    return validated.data.data;
  }

  const params = new URLSearchParams();
  params.append("dateEnd", now.toISOString());
  const url = `/api/links?${params.toString()}`;

  const { data, error, isLoading, isValidating } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true
  });

  const columns = useMemo<ColumnDef<Dashboard>[]>(
    () => [
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
        cell: ({ row }) => (
          <div className="group max-w-[400px] overflow-hidden relative whitespace-nowrap">
            <a href={row.getValue("originalUrl")} target="_blank" rel="noopener noreferrer" className="url-overflow text-[#0168d6] inline-flex items-center gap-1 font-mono align-bottom">
              <SquareArrowOutUpRight strokeWidth={1.5} className="h-4 w-4 flex-shrink-0"/>
              {cleanUrl(row.getValue("originalUrl"))}
            </a>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "shortUrl",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Shortened Url" className="text-vsecondary text-sm px-4" />,
        cell: ({ row }) => (
          <div className="flex space-x-1 items-center">
            <TooltipProvider>
              <Tooltip>
              <TooltipTrigger asChild>
              <Button onClick={() => navigator.clipboard.writeText(row.getValue("shortUrl"))} className="font-mono font-normal text-sm text-vsecondary" variant="ghost">{cleanUrl(row.getValue("shortUrl"))}</Button>
              </TooltipTrigger>
                <TooltipContent>
                  <p>Copy Short Link</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        cell: ({ row }) => <DataTableRowActions row={row} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} onViewQRClick={handleQRClick}/>
      }
    ],
    [handleEditClick]
  );

  const [rowSelection, setRowSelection] = useState({});

  const onLinkDelete = () => {
    setRowSelection({});
  }

  return (
    <div className="flex flex-col pb-14">
      <div className="pt-14"></div>
      {activeLink && <>
        <QRCodeModal isOpen={showQRModal} onOpenChange={setShowQRModal} shortUrl={activeLink.shortUrl} />
        <DeleteLinkModal onLinkDelete={onLinkDelete} isOpen={showDeleteModal} onOpenChange={setShowDeleteModal} ids={[activeLink.id]}/>
        <EditLinkModal isOpen={showEditModal} onOpenChange={setShowEditModal} id={activeLink.id} originalUrl={activeLink.originalUrl} />
      </>}
      <DataTable isLoading={isValidating} rowSelection={rowSelection} setRowSelection={setRowSelection} data={data || []} columns={columns} />
    </div>
  );
}
