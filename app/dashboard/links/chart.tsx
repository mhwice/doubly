"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClickEventTypes } from "@/lib/zod/clicks"
import { AreaChartContainer } from "./area-chart"
import { BarCharContainer } from "./bar-chart"
import { LineChartContainer } from "./line-chart"
import { differenceInCalendarDays } from "date-fns";
import { FaChartArea, FaChartLine, FaChartBar } from "react-icons/fa";

interface ChartProps {
  clickEvents: ClickEventTypes.Chart[],
  dateRange: [Date | undefined, Date]
}

export function Chart({ clickEvents, dateRange }: ChartProps) {

  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");

  return (
    <Card className="@container/card rounded-[var(--bradius)] shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-2 py-8 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Click Events</CardTitle>
          <CardDescription>
            {dateRange[0] === undefined ? "Showing total visitors for all time" :
            `Showing total visitors for the last ${differenceInCalendarDays(dateRange[1], dateRange[0])} days`}

          </CardDescription>
        </div>
        <Select value={chartType} onValueChange={(value) => setChartType(value as "area" | "bar" | "line")}>
            <SelectTrigger className="hover:bg-gray-100 border transition w-[160px] data-[placeholder]:text-primary shadow-none bg-white border-[var(--border-color)] rounded-[var(--bradius)]">
            <SelectValue placeholder="Area" />
          </SelectTrigger>
          <SelectContent className="border-[var(--border-color)] rounded-[var(--bradius)]">
            <SelectItem value="area" className="rounded-[var(--bradius)]">
              <div className="flex flex-row gap-2 items-center">
                <FaChartArea className="text-muted-foreground"/>
                Area
              </div>
            </SelectItem>
            <SelectItem value="bar" className="rounded-[var(--bradius)]">
              <div className="flex flex-row gap-2 items-center">
                <FaChartBar className="text-muted-foreground"/>
                Bar
              </div>
            </SelectItem>
            <SelectItem value="line" className="rounded-[var(--bradius)]">
              <div className="flex flex-row gap-2 items-center">
                <FaChartLine className="text-muted-foreground"/>
                Line
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {
          chartType === "area" ? <AreaChartContainer clickEvents={clickEvents} /> :
          chartType === "bar" ? <BarCharContainer clickEvents={clickEvents} /> :
          <LineChartContainer clickEvents={clickEvents} />
        }
      </CardContent>
    </Card>
  )
}
