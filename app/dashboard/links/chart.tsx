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
import BarChartIcon from "./icons/bar-chart-icon"

interface ChartProps {
  clickEvents: ClickEventTypes.Chart[],
  dateRange: [Date | undefined, Date]
}

export function Chart({ clickEvents, dateRange }: ChartProps) {

  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");

  return (
    <Card className="rounded-[var(--bradius)] shadow-none border-vborder">
      <CardHeader className="flex flex-row justify-between items-start space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-vprimary">Click Events</CardTitle>
          <CardDescription className="text-vsecondary">
            {dateRange[0] === undefined ? "Showing total visitors for all time" :
            `Showing total visitors for the last ${differenceInCalendarDays(dateRange[1], dateRange[0])} days`}
          </CardDescription>
        </div>
        <Select value={chartType} onValueChange={(value) => setChartType(value as "area" | "bar" | "line")}>
          <SelectTrigger className="bg-white hover:bg-gray-100 border transition w-[160px] shadow-none border-vborder rounded-[var(--bradius)] text-vprimary">
          <SelectValue placeholder="Area" />
        </SelectTrigger>
          <SelectContent className="border-vborder rounded-[var(--bradius)]">
            <SelectItem value="area" className="rounded-[var(--bradius)]">
              <div className="flex flex-row gap-2 items-center py-[2px] text-vprimary">
                <FaChartArea className="text-vsecondary"/>
                Area
              </div>
            </SelectItem>
            <SelectItem value="bar" className="rounded-[var(--bradius)]">
              <div className="flex flex-row gap-2 items-center py-[2px] text-vprimary">
                <FaChartBar className="text-vsecondary"/>
                Bar
              </div>
            </SelectItem>
            <SelectItem value="line" className="rounded-[var(--bradius)]">
              <div className="flex flex-row gap-2 items-center py-[2px] text-vprimary">
                <FaChartLine className="text-vsecondary"/>
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
