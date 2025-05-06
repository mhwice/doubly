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

interface TimePickerProps {
  dateRange: [Date | undefined, Date]
  setDateRange: React.Dispatch<React.SetStateAction<[Date | undefined, Date]>>,
  now: Date
}

export function TimePicker({ dateRange, setDateRange, now }: TimePickerProps) {

  const options = [
    { label: "Today", value: "today", getDates: () => ({ start: startOfDay(now), end: now }) },
    { label: "Yesterday", value: "yesterday", getDates: () => ({ start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) }) },
    { label: "Last 7 Days", value: "last-7", getDates: () => ({ start: startOfDay(subDays(now, 7)), end: now }) },
    { label: "Last 30 Days", value: "last-30", getDates: () => ({ start: startOfDay(subDays(now, 30)), end: now }) },
    { label: "Last 90 Days", value: "last-90", getDates: () => ({ start: startOfDay(subDays(now, 90)), end: now }) },
    { label: "Lasy Year", value: "last-year", getDates: () => ({ start: startOfDay(subYears(now, 1)), end: now }) },
    { label: "All Time", value: "all-time", getDates: () => ({ start: undefined, end: now })},
    // { label: "Custom", value: "custom" },
  ];

  const handleClick = (e: string) => {

    for (const { label, value, getDates } of options) {
      if (value === e) {
        const { start, end } = getDates();
        setDateRange([start, end]);
        break;
      }
    }
  }

  return (
    <Select onValueChange={(e) => handleClick(e)}>
      <SelectTrigger className="hover:bg-gray-100 border transition w-[180px] data-[placeholder]:text-vprimary shadow-none bg-white border-vborder rounded-[var(--bradius)]">
        <SelectValue placeholder="All Time" />
      </SelectTrigger>
      <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} className="border-vborder">
        <SelectGroup>
          {options.map(({ label, value }) => <SelectItem className="py-2 text-vprimary" key={value} value={value}>{label}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
