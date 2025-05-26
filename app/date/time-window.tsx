"use client";

import * as React from "react";
import { format, isToday } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  CustomComponents,
  DateRange,
  DayPicker,
  Matcher,
} from "react-day-picker";
import { isSameDay, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "react-day-picker/dist/style.css";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [selected, setSelected] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [hoverDate, setHoverDate] = React.useState<Date | undefined>(undefined);
  const [focusDate, setFocusDate] = React.useState<Date|undefined>(undefined);

  const handleMouseLeave = React.useCallback(() => setHoverDate(undefined), []);
  const handleDayFocus = React.useCallback((day: Date) => setFocusDate(day), []);
  const handleDayBlur = React.useCallback(() => setFocusDate(undefined), []);
  const pointerDate = hoverDate ?? focusDate;

  const hoverRange = React.useMemo<DateRange | undefined>(() => {
    if (selected.from && !selected.to && pointerDate) {
      return pointerDate >= selected.from
        ? { from: selected.from, to: pointerDate }
        : { from: pointerDate, to: selected.from };
    }
    return undefined;
  }, [selected.from, selected.to, pointerDate]);

  const inInterval = React.useCallback((day: Date, range?: DateRange) => {
    if (!range?.from || !range?.to) return false;
    return isWithinInterval(day, { start: range.from, end: range.to });
  }, []);

  const isSingleHover: Matcher = React.useCallback(
    (day: Date) => {
      const noneSelected = !selected?.from && !selected?.to;
      const bothSelected = !!(selected?.from && selected?.to);

      if (!(noneSelected || bothSelected)) return false;
      if (hoverDate && isToday(hoverDate)) return false;
      if (
        (selected?.from && isSameDay(day, selected.from)) ||
        (selected?.to && isSameDay(day, selected.to))
      )
        return false;

      return !!(hoverDate && isSameDay(day, hoverDate));
    },
    [selected.from, selected.to, hoverDate]
  );

  const isStart: Matcher = React.useCallback(
    (day: Date) =>
      !!(hoverRange && hoverRange.from && isSameDay(day, hoverRange.from)),
    [hoverRange]
  );
  const isEnd: Matcher = React.useCallback(
    (day: Date) =>
      !!(hoverRange && hoverRange.to && isSameDay(day, hoverRange.to)),
    [hoverRange]
  );

  const fullRange =
    selected.from && selected.to
      ? { from: selected.from, to: selected.to }
      : undefined;

  const isRowStart = React.useCallback(
    (day: Date) => inInterval(day, hoverRange) && day.getDay() === 0,
    [hoverRange, inInterval]
  );

  const isRowEnd = React.useCallback(
    (day: Date) => inInterval(day, hoverRange) && day.getDay() === 6,
    [hoverRange, inInterval]
  );

  const isRowStartSelected = React.useCallback(
    (day: Date) => inInterval(day, fullRange) && day.getDay() === 0,
    [fullRange, inInterval]
  );

  const isRowEndSelected = React.useCallback(
    (day: Date) => inInterval(day, fullRange) && day.getDay() === 6,
    [fullRange, inInterval]
  );

  const isWeekend: Matcher = React.useCallback(
    (day: Date) => day.getDay() === 0 || day.getDay() === 6,
    []
  );

  const modifiers = React.useMemo(
    () => ({
      hoverRange: hoverRange || [],
      hoverRangeStart: isStart,
      hoverRangeEnd: isEnd,
      hoverRangeRowStart: isRowStart,
      hoverRangeRowEnd: isRowEnd,
      rangeRowStart: isRowStartSelected,
      rangeRowEnd: isRowEndSelected,
      singleHover: isSingleHover,
      weekend: isWeekend,
    }),
    [
      hoverRange,
      isStart,
      isEnd,
      isRowStart,
      isRowEnd,
      isRowStartSelected,
      isRowEndSelected,
      isSingleHover,
    ]
  );

  const modifiersClassNames = React.useMemo(
    () => ({
      singleHover: "single-hover",
      hoverRange: "hover-range",
      hoverRangeStart: "hover-range-start",
      hoverRangeEnd: "hover-range-end",
      hoverRangeRowStart: "hover-range-row-start",
      hoverRangeRowEnd: "hover-range-row-end",
      selected: "selected",
      range_middle: "range_middle",
      range_start: "range_start",
      range_end: "range_end",
      rangeRowStart: "range-row-start",
      rangeRowEnd: "range-row-end",
      today: "today",
      weekend: "weekend",
      focus: "my-day-focus",
    }),
    []
  );

  const onSelect = React.useCallback((next: DateRange | undefined) => {
    setSelected((prev) => {
      if (prev.from && prev.to) {
        if (next?.to === prev.to) {
          return { from: next.from, to: undefined };
        }
        return { from: next?.to, to: undefined };
      }
      return next ?? prev;
    });
  }, []);

  const formatters = React.useMemo(
    () => ({
      formatWeekdayName: (date: Date) => {
        const days = ["S", "M", "T", "W", "T", "F", "S"];
        return days[date.getDay()];
      },
    }),
    []
  );

  const label = React.useMemo(() => {
    if (!selected.from) return "Pick a date";
    if (!selected.to) return format(selected.from, "LLL dd, y");
    return `${format(selected.from, "LLL dd, y")} - ${format(selected.to, "LLL dd, y")}`;
  }, [selected.from, selected.to]);

  const onMouseEnter = React.useCallback((day: Date) => setHoverDate(day), []);

  const components = React.useMemo<Partial<CustomComponents>>(
    () => ({
      IconLeft: ({ className, ...props }) => (
        <ChevronLeft className={cn("h-5 w-5", className)} {...props} />
      ),
      IconRight: ({ className, ...props }) => (
        <ChevronRight className={cn("h-5 w-5", className)} {...props} />
      ),
    }),
    []
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
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex flex-row" align="start">
          <div className="date-picker">
            <DayPicker
              mode="range"
              showOutsideDays={true}
              initialFocus={true}
              formatters={formatters}
              selected={selected}
              onSelect={onSelect}
              components={components}
              onDayMouseEnter={onMouseEnter}
              onDayMouseLeave={handleMouseLeave}
              onDayFocus={handleDayFocus}
              onDayBlur={handleDayBlur}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="bg-white font-normal"
              classNames={{
                months:
                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex items-center justify-between",
                caption_label: "text-sm font-medium",
                nav: "flex justify-center items-center gap-5",
                // nav_button: "flex justify-center items-center !bg-white h-7 w-7 p-0 rounded-sm ring-1 ring-transparent !border-none focus:!ring-2 focus:!ring-[#0068d6] focus:!ring-offset-1 focus:!ring-offset-white focus-visible:!ring-2 focus-visible:!ring-[#0068d6] focus-visible:!ring-offset-1 focus-visible:!ring-offset-white",
                nav_button: [
                  "flex justify-center items-center",
                  "bg-white h-7 w-7 p-0 rounded-sm",
                  "ring-1 ring-transparent",                   // base transparent ring
                  "focus:ring-2 focus:ring-[#0068d6]",
                  "focus:ring-offset-1 focus:ring-offset-white",
                  "focus-visible:ring-2 focus-visible:ring-[#0068d6]",
                  "focus-visible:ring-offset-1 focus-visible:ring-offset-white",
                ].join(" "),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex justify-evenly",
                head_cell:
                  "text-muted-foreground rounded-md font-normal text-[0.8rem] w-[40px]",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm",
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
