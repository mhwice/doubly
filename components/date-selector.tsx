"use client"

import * as React from "react"
import { addDays, endOfDay, format, startOfDay, subDays, subYears } from "date-fns"
import { Calendar, X } from "lucide-react"
import { DateRange } from "react-day-picker"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRangePicker } from "./date-range-picker"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { StyledSelectTrigger } from "@/components/doubly/ui/select"
import { Button } from "@/components/doubly/ui/button"

interface DatePickerWithRangeProps {
  now: Date,
  dateRange: [Date | undefined, Date]
  setDateRange: React.Dispatch<React.SetStateAction<[Date | undefined, Date]>>
}

export function DatePickerWithRange({ now, dateRange, setDateRange }: DatePickerWithRangeProps) {

  // this is the internally selected dates for the calendar, not the dateRange we are using to
  // filter clicks
  const [selected, setSelected] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  React.useEffect(() => {
    if (selected?.from && selected?.to) {
      setOpen(false)
      setDateRange([selected.from, addDays(selected.to, 1)]);
    }
  }, [selected.from, selected.to]);

  const [open, setOpen] = React.useState(false);

  const options = [
    { label: "Last 1 Day",   value: "yesterday", getDates: () => ({ start: subDays(now, 1), end: now }) },
    { label: "Last 7 Days",  value: "last-7",    getDates: () => ({ start: subDays(now, 7), end: now }) },
    { label: "Last 30 Days", value: "last-30",   getDates: () => ({ start: subDays(now, 30), end: now }) },
    { label: "Last 90 Days", value: "last-90",   getDates: () => ({ start: subDays(now, 90), end: now }) },
    { label: "Last 1 Year",  value: "last-year", getDates: () => ({ start: subYears(now, 1), end: now }) },
  ];

  const handleClick = (e: string) => {
    for (const { label, value, getDates } of options) {
      if (value === e) {
        const { start, end } = getDates();
        setSelected({ from: start, to: end });
        break;
      }
    }
  }

  const label = React.useMemo(() => {
    if (!selected.from || !selected.to) return "Select Date Range";
    return `${format(selected.from, "LLL dd, y")} - ${format(selected.to, "LLL dd, y")}`;
  }, [selected.from, selected.to]);

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected({ from: undefined, to: undefined });
    setDateRange([undefined, now]);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative inline-block">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            className="flex justify-start px-4 py-2 sm:w-[330px] w-full text-sm font-normal text-xtext"
          >
            <Calendar />
            {label}
          </Button>
        </PopoverTrigger>

        {(selected?.from && selected?.to) && (
          <button
            type="button"
            onClick={clear}
            className="text-xtext-secondary hover:text-xtext absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex p-2"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <Select onValueChange={(e) => handleClick(e)}>
          <StyledSelectTrigger className="w-full font-normal text-sm text-xtext-secondary">
            <SelectValue placeholder="Date presets" />
          </StyledSelectTrigger>
          <SelectContent position="popper" onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectGroup>
              {options.map(({ label, value }) => <SelectItem className="py-2 text-xtext" key={value} value={value}>{label}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DateRangePicker selected={selected} setSelected={setSelected}/>
      </PopoverContent>
    </Popover>
  )
}

