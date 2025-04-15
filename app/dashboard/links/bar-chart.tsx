"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { ClickEventTypes } from "@/lib/zod/clicks"

const chartConfig = {
  visitors: {
    label: "Clicks",
  },
  linkCount: {
    label: "Link",
    color: "hsl(var(--chart-1))",
  },
  qrCount: {
    label: "QR",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface ChartProps {
  clickEvents: ClickEventTypes.Chart[]
}

export function BarCharContainer(clickEvents: ChartProps) {

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
      <BarChart accessibilityLayer data={clickEvents.clickEvents}>
      <CartesianGrid vertical={false} />
        <Bar
          dataKey="linkCount"
          stackId="a"
          fill="var(--color-linkCount)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="qrCount"
          stackId="a"
          fill="var(--color-qrCount)"
          radius={[4, 4, 0, 0]}
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
      </BarChart>
    </ChartContainer>
  )
}
