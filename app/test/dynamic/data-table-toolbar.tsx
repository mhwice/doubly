"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "../static/data-table-view-options"

import { sources, continents, countries, cities, originalUrls, shortUrls } from "../data"
import { DataTableFacetedFilter } from "../static/data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("country")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("country")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("source") && (
          <DataTableFacetedFilter
            column={table.getColumn("source")}
            title="Source"
            options={sources}
          />
        )}
        {table.getColumn("continent") && (
          <DataTableFacetedFilter
            column={table.getColumn("continent")}
            title="Continent"
            options={continents}
          />
        )}
        {table.getColumn("country") && (
          <DataTableFacetedFilter
            column={table.getColumn("country")}
            title="Country"
            options={countries}
          />
        )}
        {table.getColumn("city") && (
          <DataTableFacetedFilter
            column={table.getColumn("city")}
            title="City"
            options={cities}
          />
        )}
        {table.getColumn("originalUrl") && (
          <DataTableFacetedFilter
            column={table.getColumn("originalUrl")}
            title="Original URL"
            options={originalUrls}
          />
        )}
        {table.getColumn("shortUrl") && (
          <DataTableFacetedFilter
            column={table.getColumn("shortUrl")}
            title="Short URL"
            options={shortUrls}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
