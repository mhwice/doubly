"use client";

import * as React from "react";
import { format, isToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange, DayPicker, Matcher } from "react-day-picker";
import { isSameDay, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import "react-day-picker/dist/style.css";

export function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>();

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
    const isStartSelected: Matcher = day => !!(fullRange && isSameDay(day, fullRange.start));
    const isEndSelected: Matcher = day => !!(fullRange && isSameDay(day, fullRange.end));
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
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex flex-row" align="start">

        <DayPicker
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
            onDayMouseEnter={(d) => setHoverDate(d)}

            modifiers={{
              hoverRange: hoverRange || [],
              hoverRangeStart: isStart,
              hoverRangeEnd:   isEnd,
              hoverRangeRowEnd: isRowEnd,
              hoverRangeRowStart: isRowStart,
              rangeRowStart: isRowStartSelected,
              rangeRowEnd: isRowEndSelected,
              singleHover: isSingleHover
            }}
            modifiersClassNames={{
              singleHover: "single-hover",
              hoverRange:        "hover-range",
              hoverRangeStart:   "hover-range-start",
              hoverRangeEnd:     "hover-range-end",
              hoverRangeRowEnd:  "hover-range-row-end",
              hoverRangeRowStart:"hover-range-row-start",
              // selected:          "!bg-red-500",
              // selected:          "bg-primary text-primary-foreground",
              selected:            'selected',
              range_middle:        'range_middle',
              range_start:         'range_start',
              range_end:           'range_end',
              rangeRowStart: "range-row-start",
              rangeRowEnd:   "range-row-end",
              today:             "today",
              // range_start:       "rounded-l-full bg-accent/30 text-accent-foreground",
              // range_end:         "rounded-r-full bg-accent/30 text-accent-foreground",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/*

I want the middle of the hover range to have a



          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(d) => {
              if (date?.from && date?.to) {
                if (d?.to === date.to) {
                  // d.from is the new value to take
                  setDate({ from: d.from, to: undefined });
                } else {
                  // d.to is the new value to take
                  setDate({ from: d?.to, to: undefined });
                }
              } else {
                setDate(d);
              }
            }}
            onDayMouseEnter={(_, __, event) => {
              // 1) Early exit / full reset
              if ((date?.from && date?.to) || (!date?.from && !date?.to)) {
                // clear Tds
                [firstHoveredTd, lastHoveredTd].forEach(ref => {
                  if (ref.current) {
                    ref.current.classList.remove(
                      ref === firstHoveredTd ? 'first-hovered' : 'last-hovered'
                    )
                  }
                  ref.current = null
                })
                // clear Buttons
                if (firstHoveredButton.current) {
                  firstHoveredButton.current.classList.remove('first-hovered-button');
                  firstHoveredButton.current = null;
                }
                if (lastHoveredButton.current) {
                  lastHoveredButton.current.classList.remove('last-hovered-button');
                  lastHoveredButton.current = null;
                }

                return
              }

              // 2) Compute hovered buttons
              const btn = event.target as HTMLButtonElement
              const tbody = btn.closest('tbody')
              if (!tbody) return

              const buttons       = Array.from(tbody.querySelectorAll('button'))
              const currentIndex  = buttons.indexOf(btn)
              const selectedIndex = buttons.findIndex(b => b.getAttribute('aria-selected') === 'true')
              if (selectedIndex === -1) return

              const start = Math.min(currentIndex, selectedIndex)
              const end   = Math.max(currentIndex, selectedIndex)
              const hoveredButtons = buttons.slice(start, end + 1)

              // 3) Update data-hover on each <button> and its <td>
              buttons.forEach(b => {
                const inRange = hoveredButtons.includes(b)
                b.setAttribute('data-hover', inRange ? 'true' : 'false')
                const cell = b.closest('td')
                if (cell) cell.setAttribute('data-hover', inRange ? 'true' : 'false')
              })

              // 4) Remove old button-classes
              if (firstHoveredButton.current) {
                firstHoveredButton.current.classList.remove('first-hovered-button')
              }
              if (lastHoveredButton.current) {
                lastHoveredButton.current.classList.remove('last-hovered-button')
              }

              // 5) Mark new first/last buttons
              const newFirstBtn = hoveredButtons.length
                ? hoveredButtons[0]
                : null
              const newLastBtn  = hoveredButtons.length
                ? hoveredButtons[hoveredButtons.length - 1]
                : null

              if (newFirstBtn) {
                newFirstBtn.classList.add('first-hovered-button')
                firstHoveredButton.current = newFirstBtn
              } else {
                firstHoveredButton.current = null
              }

              if (newLastBtn) {
                newLastBtn.classList.add('last-hovered-button')
                lastHoveredButton.current = newLastBtn
              } else {
                lastHoveredButton.current = null
              }

              // 6) Remove old first/last cell-classes
              if (firstHoveredTd.current) {
                firstHoveredTd.current.classList.remove('first-hovered')
              }
              if (lastHoveredTd.current) {
                lastHoveredTd.current.classList.remove('last-hovered')
              }

              // 7) Mark new first/last cells
              const firstTd = newFirstBtn?.closest('td') ?? null
              const lastTd  = newLastBtn?.closest('td')  ?? null

              if (firstTd) {
                firstTd.classList.add('first-hovered')
                firstHoveredTd.current = firstTd
              } else {
                firstHoveredTd.current = null
              }

              if (lastTd) {
                lastTd.classList.add('last-hovered')
                lastHoveredTd.current = lastTd
              } else {
                lastHoveredTd.current = null
              }
            }}

          />
          <div className="bg-red-200 w-[200px] h-auto"></div>


*/
