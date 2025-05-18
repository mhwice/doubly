"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { ClickChartChart } from "@/lib/zod/clicks"

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
  clickEvents: ClickChartChart[]
}

export function ChartAreaInteractive(clickEvents: ChartProps) {

  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // const filteredData = clickEvents.filter((item) => {
  //   const date = new Date(item.day)
  //   const referenceDate = new Date(Date.now())
  //   let daysToSubtract = 90
  //   if (timeRange === "30d") {
  //     daysToSubtract = 30
  //   } else if (timeRange === "7d") {
  //     daysToSubtract = 7
  //   }
  //   const startDate = new Date(referenceDate)
  //   startDate.setDate(startDate.getDate() - daysToSubtract)
  //   return date >= startDate
  // })

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Clicks Events</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Total for the last X months</span>
          <span className="@[540px]/card:hidden">Last X months</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
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
      </CardContent>
    </Card>
  )
}
