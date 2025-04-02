"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

import { shortUrls, originalUrls, sources, continents, countries, cities } from "../data";
import { DataTableColumnHeader } from "../static/data-table-column-header"
import Image from "next/image"
import { ClickEventTypes } from "@/lib/zod/clicks"

// w-[100px]
export const columns: ColumnDef<ClickEventTypes.Fake>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Short link" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "shortUrl",
    // maxSize: 20,
    // size: 300,
    // minSize: 300,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Short URL" />
    ),
    cell: ({ row }) => {
      const shortUrl = shortUrls.find((shortUrl) => shortUrl.value === row.getValue("shortUrl"));
      if (!shortUrl) return null;

      return (
        // <div className="flex items-center bg-blue-100">
        <div className="flex items-center bg-blue-100">
          {/* {originalUrl.icon && (
            <originalUrl.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          {/* <div className="overflow-hidden rounded-[3px] shadow-md mr-1">
            <Image src={`/flags/${source.country}.svg`} alt="flag" width={20} height={15} />
          </div> */}
          <span>{shortUrl.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "originalUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Original URL" />
    ),
    cell: ({ row }) => {
      const originalUrl = originalUrls.find((originalUrl) => originalUrl.value === row.getValue("originalUrl"));
      if (!originalUrl) return null;

      return (
        <div className="flex items-center bg-green-100">
          {/* {originalUrl.icon && (
            <originalUrl.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          {/* <div className="overflow-hidden rounded-[3px] shadow-md mr-1">
            <Image src={`/flags/${source.country}.svg`} alt="flag" width={20} height={15} />
          </div> */}
          <span>{originalUrl.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => {
      const source = sources.find((source) => source.value === row.getValue("source"));
      if (!source) return null;

      return (
        <div className="flex items-center bg-red-100">
          {source.icon && (
            <source.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          {/* <div className="overflow-hidden rounded-[3px] shadow-md mr-1">
            <Image src={`/flags/${source.country}.svg`} alt="flag" width={20} height={15} />
          </div> */}
          <span>{source.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "continent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Continent" />
    ),
    cell: ({ row }) => {
      const continent = continents.find(
        (continent) => continent.value === row.getValue("continent")
      )

      if (!continent) {
        return null
      }

      return (
        <div className="flex items-center bg-orange-100">
          {/* {continent.icon && (
            <continent.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          <span>{continent.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    // size: 10,
    cell: ({ row }) => {
      const country = countries.find(
        (country) => country.value === row.getValue("country")
      )

      if (!country) {
        return null
      }

      return (
        <div className="flex items-center bg-yellow-100">

          {country.code && (
            <div className="overflow-hidden rounded-[3px] shadow-sm mr-2">
              <Image src={`/flags/${country.code}.svg`} alt="flag" width={20} height={15} />
            </div>
          )}

          <span>{country.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
    cell: ({ row }) => {
      const city = cities.find(
        (city) => city.value === row.getValue("city")
      )

      if (!city) {
        return null
      }

      return (
        <div className="flex items-center bg-purple-100">
          {/* {city.icon && (
            <city.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          <span>{city.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
