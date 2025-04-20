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
// import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [badIds, setBadIds] = React.useState<number[]>([]);

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

  return (
    <div className="space-y-4">
      <DeleteLinkModal isOpen={showDeleteModal} onOpenChange={setShowDeleteModal} linkIds={badIds}/>
      {/* <DataTableToolbar table={table} /> */}
      <div className="flex items-center w-full justify-between">
        <Input
          placeholder="Filter original urls..."
          value={(table.getColumn("originalUrl")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("originalUrl")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white rounded-[var(--bradius)] shadow-none border-vborder text-vprimary placeholder:text-vsecondary"
        />
        <div className="flex gap-2">
          {table.getFilteredSelectedRowModel().rows.length >= 2 && (
            <Button onClick={() => handleOnMultipleDeleteClicked(table.getFilteredSelectedRowModel().rows)} variant="destructiveFlat">Delete {table.getFilteredSelectedRowModel().rows.length}</Button>
          )}
          <NewLinkButton />
        </div>
      </div>
      <div className="border overflow-hidden bg-white rounded-[var(--bradius)] shadow-none border-vborder">
        <Table>
          <TableHeader className="bg-white">
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
                    <TableCell key={cell.id}>
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
                  No results.
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
