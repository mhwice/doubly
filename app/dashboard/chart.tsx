"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClickEventTypes } from "@/lib/zod/clicks"
import { AreaChartContainer } from "./area-chart"
import { BarCharContainer } from "./bar-chart"
import { LineChartContainer } from "./line-chart"
import { differenceInCalendarDays } from "date-fns";

interface ChartProps {
  clickEvents: ClickEventTypes.Chart[],
  dateRange: [Date | undefined, Date]
}

export function Chart({ clickEvents, dateRange }: ChartProps) {

  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");

  return (
    <Card className="@container/card">
      <CardHeader className="flex items-center gap-2 space-y-2 py-8 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Click Events</CardTitle>
          <CardDescription>
            {dateRange[0] === undefined ? "Showing total visitors for all time" :
            `Showing total visitors for the last ${differenceInCalendarDays(dateRange[1], dateRange[0])} days`}

          </CardDescription>
        </div>
        <Select value={chartType} onValueChange={(value) => setChartType(value as "area" | "bar" | "line")}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Area" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="area" className="rounded-lg">
              Area
            </SelectItem>
            <SelectItem value="bar" className="rounded-lg">
              Bar
            </SelectItem>
            <SelectItem value="line" className="rounded-lg">
              Line
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
