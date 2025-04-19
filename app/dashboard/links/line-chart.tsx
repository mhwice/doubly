"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { ClickEventTypes } from "@/lib/zod/clicks"

const chartConfig = {
  visitors: {
    label: "Clicks",
  },
  linkCount: {
    label: "Link",
    color: "var(--database)",
  },
  qrCount: {
    label: "QR",
    color: "var(--database-secondary)",
  },
} satisfies ChartConfig

interface ChartProps {
  clickEvents: ClickEventTypes.Chart[]
}

export function LineChartContainer(clickEvents: ChartProps) {

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={clickEvents.clickEvents}
        margin={{
          left: 12,
          right: 12,
        }}
      >
      <CartesianGrid vertical={false} />

        <Line
          dataKey="linkCount"
          type="monotone"
          stroke="var(--color-linkCount)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="qrCount"
          type="monotone"
          stroke="var(--color-qrCount)"
          strokeWidth={2}
          dot={false}
        />
      <XAxis
        dataKey="date"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        minTickGap={32}
        tickFormatter={(value) => {
          return value.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        }}
      />
      <ChartTooltip
        cursor={false}
        content={
          <ChartTooltipContent
            labelFormatter={(value) => {
              return new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }}
            indicator="dot"
          />
        }
      />
      <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  )
}
