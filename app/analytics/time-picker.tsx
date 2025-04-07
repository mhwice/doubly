"use client";

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { subYears, subMonths, subDays, startOfDay, endOfDay, getDate } from "date-fns";

const options = [
  { label: "Today", value: "today", getDates: () => ({ start: startOfDay(new Date()), end: new Date() }) },
  { label: "Yesterday", value: "yesterday", getDates: () => ({ start: startOfDay(subDays(new Date(), 1)), end: endOfDay(subDays(new Date(), 1)) }) },
  { label: "Last 7 Days", value: "last-7", getDates: () => ({ start: startOfDay(subDays(new Date(), 7)), end: new Date() }) },
  { label: "Last 30 Days", value: "last-30", getDates: () => ({ start: startOfDay(subDays(new Date(), 30)), end: new Date() }) },
  { label: "Last 90 Days", value: "last-90", getDates: () => ({ start: startOfDay(subDays(new Date(), 90)), end: new Date() }) },
  { label: "Lasy Year", value: "last-year", getDates: () => ({ start: startOfDay(subYears(new Date(), 1)), end: new Date() }) },
  { label: "All Time", value: "all-time", getDates: () => ({ start: subYears(new Date(), 30), end: new Date() })},
  // { label: "Custom", value: "custom" },
];

interface TimePickerProps {
  dateRange: [Date | undefined, Date]
  setDateRange: React.Dispatch<React.SetStateAction<[Date | undefined, Date]>>
}

export function TimePicker({ dateRange, setDateRange }: TimePickerProps) {

  const handleClick = (e: string) => {

    for (const { label, value, getDates } of options) {
      if (value === e) {
        const { start, end} = getDates();
        setDateRange([start, end]);
        break;
      }
    }
  }

  return (
    <Select onValueChange={(e) => handleClick(e)}>
      <SelectTrigger className="hover:bg-gray-100 border transition w-[180px] data-[placeholder]:text-primary">
        <SelectValue placeholder="Filter by date" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time Window</SelectLabel>
          {options.map(({ label, value }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
