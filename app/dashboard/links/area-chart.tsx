"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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

export function AreaChartContainer(clickEvents: ChartProps) {

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
      <AreaChart data={clickEvents.clickEvents}>
        <defs>
          <linearGradient id="fillLink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-linkCount)" stopOpacity={1.0} />
            <stop offset="95%" stopColor="var(--color-linkCount)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillQR" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-qrCount)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-qrCount)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
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
        <Area dataKey="qrCount" type="bump" fill="url(#fillQR)" stroke="var(--color-qrCount)" stackId="a" />
        <Area dataKey="linkCount" type="bump" fill="url(#fillLink)" stroke="var(--color-linkCount)" stackId="a" />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )
}
