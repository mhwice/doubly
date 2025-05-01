"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, BarChartHorizontal } from "lucide-react"

export default function ABTestingExample() {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle>A/B Testing Results</CardTitle>
        <CardDescription>Compare performance between two versions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="comparison" className="space-y-4">
            <div className="mt-4 space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium">Version A: "Limited Time Offer"</div>
                  <div className="text-sm font-medium">124 clicks</div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted">
                  <div className="h-2.5 rounded-full bg-primary" style={{ width: "62%" }}></div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium">Version B: "Exclusive Deal"</div>
                  <div className="text-sm font-medium">76 clicks</div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted">
                  <div className="h-2.5 rounded-full bg-primary/70" style={{ width: "38%" }}></div>
                </div>
              </div>

              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <p className="font-medium">Results Summary:</p>
                <p className="mt-1 text-muted-foreground">
                  Version A outperformed Version B by 63% with higher engagement across all demographics.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="insights">
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <BarChart className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Peak Engagement Times</p>
                  <p className="text-sm text-muted-foreground">
                    Both versions performed best between 6-8pm local time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BarChartHorizontal className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Geographic Insights</p>
                  <p className="text-sm text-muted-foreground">
                    Version A resonated more with urban audiences, while Version B performed better in suburban areas.
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <p className="font-medium">Recommendation:</p>
                <p className="mt-1 text-muted-foreground">
                  Use "Limited Time Offer" messaging for future campaigns, especially when targeting urban demographics.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
