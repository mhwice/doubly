import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  QrCodeIcon,
  LinkIcon,
  MousePointerClickIcon
} from "lucide-react"

/*

count of urls
count of link clicks
count of qr clicks

I can give some additional info like how many urls/clicks now vs last week or something like that.

*/

interface StatsHeaderProps {
  stats: {
    numUrls: number,
    numLinkClicks: number,
    numQRClicks: number
  }
}

export function StatsHeader({ stats }: StatsHeaderProps) {
  const { numUrls, numLinkClicks, numQRClicks } = stats;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Urls
          </CardTitle>
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{numUrls}</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Link Clicks
          </CardTitle>
          <MousePointerClickIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{numLinkClicks}</div>
          <p className="text-xs text-muted-foreground">
            +180.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total QR Clicks</CardTitle>
          <QrCodeIcon className="h-4 w-4 text-muted-foreground"/>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{numQRClicks}</div>
          <p className="text-xs text-muted-foreground">
            +19% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
