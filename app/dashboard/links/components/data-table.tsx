"use client";

import * as React from "react";
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
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "../static-components/data-table-pagination";
import { LinkTypes } from "@/lib/zod/links";
import { DeleteLinkModal } from "@/components/delete-link-modal";
import { useCurrentFilters } from "../../filters-context";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/doubly/ui/button";
import { SearchInput } from "@/components/doubly/ui/search-input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection: {};
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  isLoading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  isLoading,
}: DataTableProps<TData, TValue>) {
  // const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
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
  });

  const handleOnMultipleDeleteClicked = (rows: Row<TData>[]) => {
    const ids = [];
    for (const row of rows) {
      const link = row.original as LinkTypes.Dashboard;
      const linkId = link.id;
      ids.push(linkId);
    }

    setBadIds(ids);
    setShowDeleteModal(true);
  };

  const viewManyAnalytics = (rows: Row<TData>[]) => {
    const shortUrls: [string, string][] = [];
    for (const row of rows) {
      const link = row.original as LinkTypes.Dashboard;
      const linkId = link.shortUrl;
      shortUrls.push(["shortUrl", linkId]);
    }

    setFilters(shortUrls);
    router.push("/dashboard/analytics");
  };

  const onLinkDelete = () => {
    setRowSelection({});
  };

  return (
    <div className="space-y-4">
      <DeleteLinkModal
        onLinkDelete={onLinkDelete}
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        ids={badIds}
      />
      <div className="flex gap-2 flex-col-reverse md:flex-row md:items-center w-full justify-between">
        <SearchInput
          placeholder="Enter a url..."
          value={(table.getColumn("originalUrl")?.getFilterValue() as string) ?? ""}
          setValue={(value) => table.getColumn("originalUrl")?.setFilterValue(value)}
        />
        <div className="flex gap-2">
          {table.getFilteredSelectedRowModel().rows.length >= 1 ? (
            <>
              <Button
                variant="destructive"
                onClick={() => handleOnMultipleDeleteClicked(table.getFilteredSelectedRowModel().rows)}
              >Delete {table.getFilteredSelectedRowModel().rows.length}</Button>
              <Button
                variant="outline"
                disabled={table.getFilteredSelectedRowModel().rows.length > 50}
                onClick={() => viewManyAnalytics(table.getFilteredSelectedRowModel().rows)}
              >
                View Analytics for {table.getFilteredSelectedRowModel().rows.length} Links
              </Button>
            </>
          ) : (
            <RefreshButton isLoading={isLoading} />

          )}
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((_, idx) => (
                <TableRow key={`${idx}-row`}>
                  <TableCell
                    key={`${idx}-cell`}
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <Skeleton className="w-full h-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <>
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
                      <p className="text-vprimary text-base font-medium py-2">
                        No data found.
                      </p>
                      <p className="text-vsecondary text-sm font-normal pb-2">
                        Click the 'Create Link' button above to get started.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
