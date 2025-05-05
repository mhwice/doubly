"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "../static-components/data-table-pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NewLinkButton } from "../new-link-button"
import { LinkTypes } from "@/lib/zod/links"
import { DeleteLinkModal } from "@/components/delete-link-modal"
import { useCurrentFilters } from "../../filters-context"
import { useRouter } from "next/navigation"
import { RefreshCw, Search } from "lucide-react"
import { useCurrentDate } from "../../date-context"
import { RefreshButton } from "@/components/refresh-button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  rowSelection: {},
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>,
  isLoading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  isLoading
}: DataTableProps<TData, TValue>) {
  // const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [badIds, setBadIds] = React.useState<number[]>([]);

  const router = useRouter();
  const { setFilters } = useCurrentFilters();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const handleOnMultipleDeleteClicked = (rows: Row<TData>[]) => {
    const ids = [];
    for (const row of rows) {
      const link = row.original as LinkTypes.Dashboard;
      const linkId = link.id;
      ids.push(linkId);
    }

    setBadIds(ids);
    setShowDeleteModal(true);
  }

  const viewManyAnalytics = (rows: Row<TData>[]) => {
    const shortUrls: [string, string][] = [];
    for (const row of rows) {
      const link = row.original as LinkTypes.Dashboard;
      const linkId = link.shortUrl;
      shortUrls.push(['shortUrl', linkId]);
    }

    setFilters(shortUrls);
    router.push("/dashboard/analytics");
  }

  const { date: now, setDate } = useCurrentDate();

  // const handleOnRefreshClicked = () => {
  //   const newNow = new Date();
  //   setDate(newNow);
  // }

  const onLinkDelete = () => {
    setRowSelection({});
  }

  return (
    <div className="space-y-4">
      <DeleteLinkModal onLinkDelete={onLinkDelete} isOpen={showDeleteModal} onOpenChange={setShowDeleteModal} ids={badIds}/>
      {/* <DataTableToolbar table={table} /> */}
      <div className="flex gap-2 flex-col-reverse md:flex-row md:items-center w-full justify-between">
        {/* <Input
          placeholder="Filter original urls..."
          value={(table.getColumn("originalUrl")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("originalUrl")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white rounded-[var(--bradius)] shadow-none border-vborder text-vprimary placeholder:text-vsecondary"
        /> */}
        <div
          className="
            max-[420px]:w-[100%]
            sm:w-[400px]
            flex items-center
            rounded-[var(--bradius)] border border-vborder
            bg-white overflow-hidden
            transition duration-300 ease-in-out
            [&:not(:focus-within):hover]:border-[#c9c9c9]
            focus-within:border-[#8d8d8d]
            focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,0,0.08)]
          "
        >
          <div className="flex-shrink-0 px-3 py-[10px] bg-white text-[#8f8f8f] text-sm font-normal border-vborder">
            <Search className="w-5 h-5"/>
          </div>
          <input
            type="text"
            value={(table.getColumn("originalUrl")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("originalUrl")?.setFilterValue(event.target.value)
            }
            placeholder="enter a url..."
            className="w-full py-2 text-vprimary text-sm outline-none placeholder:text-[#8f8f8f]"
          />
        </div>
        <div className="flex gap-2">
          {table.getFilteredSelectedRowModel().rows.length >= 1 ? (
            <>
              <Button onClick={() => handleOnMultipleDeleteClicked(table.getFilteredSelectedRowModel().rows)} variant="destructiveFlat">Delete {table.getFilteredSelectedRowModel().rows.length}</Button>
              <Button disabled={table.getFilteredSelectedRowModel().rows.length > 50} onClick={() => viewManyAnalytics(table.getFilteredSelectedRowModel().rows)} variant="flat">View Analytics for {table.getFilteredSelectedRowModel().rows.length} Links</Button>
            </>
          ) :
          // <Button onClick={handleOnRefreshClicked} variant="flat" className="text-vprimary font-normal"><RefreshCw strokeWidth={1.75} className="text-vprimary"/>Refresh</Button>
          <RefreshButton isLoading={isLoading} />
          }
        </div>
      </div>
      <div className="border overflow-hidden bg-white rounded-[var(--bradius)] shadow-none border-vborder">
        <Table>
          <TableHeader className="bg-[var(--dashboard-bg)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-vborder">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group border-vborder"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <p className="text-vprimary text-base font-medium py-2">No data found.</p>
                  <p className="text-vsecondary text-sm font-normal pb-2">Click the 'Create Link' button above to get started.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
