import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  // return (
  //   <div className="flex items-center justify-between px-2">
  //     <div className="flex-1 text-sm text-vsecondary">
  //       {table.getFilteredSelectedRowModel().rows.length} of{" "}
  //       {table.getFilteredRowModel().rows.length} row(s) selected.
  //     </div>
  //     <div className="flex items-center space-x-6 lg:space-x-8">
  //       <div className="flex items-center space-x-2">
  //         <p className="text-sm font-medium text-vprimary">Rows per page</p>
  //         <Select
  //           value={`${table.getState().pagination.pageSize}`}
  //           onValueChange={(value) => {
  //             table.setPageSize(Number(value))
  //           }}
  //         >
  //           <SelectTrigger className="h-8 w-[70px] bg-white shadow-none">
  //             <SelectValue placeholder={table.getState().pagination.pageSize} />
  //           </SelectTrigger>
  //           <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} side="top">
  //             {[10, 20, 30, 40, 50].map((pageSize) => (
  //               <SelectItem key={pageSize} value={`${pageSize}`} className="text-vprimary">
  //                 {pageSize}
  //               </SelectItem>
  //             ))}
  //           </SelectContent>
  //         </Select>
  //       </div>
  //       <div className="flex w-[100px] items-center justify-center text-sm font-medium text-vprimary">
  //         Page {table.getState().pagination.pageIndex + 1} of{" "}
  //         {table.getPageCount()}
  //       </div>
  //       <div className="flex items-center space-x-2">
  //         <Button
  //           variant="flat"
  //           className="hidden h-8 w-8 p-0 lg:flex"
  //           onClick={() => table.setPageIndex(0)}
  //           disabled={!table.getCanPreviousPage()}
  //         >
  //           <ChevronsLeft className="text-vprimary"/>
  //         </Button>
  //         <Button
  //           variant="flat"
  //           className="h-8 w-8 p-0"
  //           onClick={() => table.previousPage()}
  //           disabled={!table.getCanPreviousPage()}
  //         >
  //           <ChevronLeft className="text-vprimary"/>
  //         </Button>
  //         <Button
  //           variant="flat"
  //           className="h-8 w-8 p-0"
  //           onClick={() => table.nextPage()}
  //           disabled={!table.getCanNextPage()}
  //         >
  //           <ChevronRight className="text-vprimary"/>
  //         </Button>
  //         <Button
  //           variant="flat"
  //           className="hidden h-8 w-8 p-0 lg:flex"
  //           onClick={() => table.setPageIndex(table.getPageCount() - 1)}
  //           disabled={!table.getCanNextPage()}
  //         >
  //           <ChevronsRight className="text-vprimary"/>
  //         </Button>
  //       </div>
  //     </div>
  //   </div>
  // )
  return (
    <div className="flex flex-col gap-y-4 px-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-vsecondary text-center sm:text-left">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex items-center gap-y-4 gap-x-10 sm:gap-x-6 lg:gap-x-8 justify-center">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-vprimary whitespace-nowrap">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px] bg-white shadow-none">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent
              onCloseAutoFocus={(e) => e.preventDefault()}
              side="top"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="text-vprimary">
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-vprimary whitespace-nowrap">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="flat"
            className="hidden h-8 w-8 p-0 md:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="text-vprimary" />
          </Button>
          <Button
            variant="flat"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="text-vprimary" />
          </Button>
          <Button
            variant="flat"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="text-vprimary" />
          </Button>
          <Button
            variant="flat"
            className="hidden h-8 w-8 p-0 md:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="text-vprimary" />
          </Button>
        </div>
        </div>
      </div>
    </div>
  )

}
