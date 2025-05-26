"use client";

import * as React from "react";
import { format, isToday } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange, DayPicker, Matcher } from "react-day-picker";
import { isSameDay, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import "react-day-picker/dist/style.css";
import { Calendar } from "@/components/ui/calendar";

export function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [selected, setSelected] = React.useState<DateRange>({ from: undefined, to: undefined })
  const [hoverDate, setHoverDate] = React.useState<Date | undefined>(undefined)

  let hoverRange: Matcher | undefined = undefined;
  if (selected.from && !selected.to && hoverDate) {
    if (hoverDate >= selected.from) {
      hoverRange = { from: selected.from, to: hoverDate };
    } else {
      hoverRange = { from: hoverDate, to: selected.from };
    }
  }

  const isSingleHover: Matcher = (day) => {
    const noneSelected = !selected?.from && !selected?.to;
    const bothSelected = !!(selected?.from && selected?.to);

    // only in the “no dates” or “both dates” states
    if (!(noneSelected || bothSelected)) return false;

    // dont highlight today
    if (hoverDate && isToday(hoverDate)) return false;

    // don’t highlight your actual selected endpoints
    if (
      (selected?.from && isSameDay(day, selected.from)) ||
      (selected?.to   && isSameDay(day, selected.to))
    ) {
      return false;
    }

    // and only highlight the one you’re hovering
    return !!(hoverDate && isSameDay(day, hoverDate));
  };

    const isStart: Matcher = (d) => !!(hoverRange && hoverRange.from && isSameDay(d, hoverRange.from));
    const isEnd:   Matcher = (d) => !!(hoverRange && hoverRange.to && isSameDay(d, hoverRange.to));
    const isRowEnd: Matcher = (day) =>
      !!(
        hoverRange &&
        isWithinInterval(day, { start: hoverRange.from!, end: hoverRange.to! }) &&
        day.getDay() === 6
      );

    const isRowStart: Matcher = (day) =>
      !!(
        hoverRange &&
        isWithinInterval(day, { start: hoverRange.from!, end: hoverRange.to! }) &&
        day.getDay() === 0
      );

    const fullRange = selected.from && selected.to ? { start: selected.from, end: selected.to } : undefined;
    const isRowStartSelected: Matcher = day =>
      !!(
        fullRange &&
        isWithinInterval(day, fullRange) &&
        day.getDay() === 0    // Sunday
      );
    const isRowEndSelected: Matcher = day =>
      !!(
        fullRange &&
        isWithinInterval(day, fullRange) &&
        day.getDay() === 6    // Saturday
      );

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {selected?.from ? (
              selected.to ? (
                <>
                  {format(selected.from, "LLL dd, y")} -{" "}
                  {format(selected.to, "LLL dd, y")}
                </>
              ) : (
                format(selected.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex flex-row" align="start">

        <DayPicker
            formatters={{
              formatWeekdayName: (date: Date) => {
                const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
                return days[dayOfWeek];
              }
            }}

            showOutsideDays={true}
            mode="range"
            selected={selected}
            onSelect={(d) => {
              if (selected?.from && selected?.to) {
                if (d?.to === selected.to) {
                  // d.from is the new value to take
                  setSelected({ from: d.from, to: undefined });
                } else {
                  // d.to is the new value to take
                  setSelected({ from: d?.to, to: undefined });
                }
              } else {
                if (d) setSelected(d);
              }
            }}
            className="bg-white font-normal"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex items-center justify-between",
              caption_label: "text-sm font-medium",
              nav: "flex items-center gap-5",
              nav_button: "!bg-white h-7 w-7 p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex justify-evenly",
              head_cell: "text-muted-foreground rounded-md font-normal text-[0.8rem] w-[40px]",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm",
            }}

            components={{
              IconLeft: ({ className, ...props }) => (
                <ChevronLeft className={cn("h-5 w-5", className)} {...props} />
              ),
              IconRight: ({ className, ...props }) => (
                <ChevronRight className={cn("h-5 w-5", className)} {...props} />
              ),
            }}

            onDayMouseEnter={(d) => setHoverDate(d)}
            modifiers={{
              hoverRange: hoverRange || [],
              hoverRangeStart: isStart,
              hoverRangeEnd:   isEnd,
              hoverRangeRowEnd: isRowEnd,
              hoverRangeRowStart: isRowStart,
              rangeRowStart: isRowStartSelected,
              rangeRowEnd: isRowEndSelected,
              singleHover: isSingleHover,
              weekend: (day) => {
                return (day.getDay() === 0 || day.getDay() === 6);
              }
            }}
            modifiersClassNames={{
              singleHover: "single-hover",
              hoverRange:        "hover-range",
              hoverRangeStart:   "hover-range-start",
              hoverRangeEnd:     "hover-range-end",
              hoverRangeRowEnd:  "hover-range-row-end",
              hoverRangeRowStart:"hover-range-row-start",
              selected:            'selected',
              range_middle:        'range_middle',
              range_start:         'range_start',
              range_end:           'range_end',
              rangeRowStart: "range-row-start",
              rangeRowEnd:   "range-row-end",
              today:             "today",
              weekend: 'weekend'
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
