import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  QrCodeIcon,
  LinkIcon,
  MousePointerClickIcon
} from "lucide-react"

import NumberFlow from '@number-flow/react'

/*

count of urls
count of link clicks
count of qr clicks

I can give some additional info like how many urls/clicks now vs last week or something like that.

*/

interface StatsHeaderProps {
  stats: {
    numLinks: number,
    linkClicks: number,
    qrClicks: number
  }
}

export function StatsHeader({ stats }: StatsHeaderProps) {
  const { numLinks, linkClicks, qrClicks } = stats;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="rounded-[var(--bradius)] shadow-none border-vborder">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vprimary">
            Urls
          </CardTitle>
          <LinkIcon className="h-4 w-4 text-vsecondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"><NumberFlow value={numLinks}/></div>
          <p className="text-xs text-vsecondary">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card className="rounded-[var(--bradius)] shadow-none border-vborder">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vprimary">
            Total Link Clicks
          </CardTitle>
          <MousePointerClickIcon className="h-4 w-4 text-vsecondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vprimary"><NumberFlow value={linkClicks} /></div>
          <p className="text-xs text-vsecondary">
            +180.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card className="rounded-[var(--bradius)] shadow-none border-vborder">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vprimary">Total QR Clicks</CardTitle>
          <QrCodeIcon className="h-4 w-4 text-vsecondary"/>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-vprimary"><NumberFlow value={qrClicks} /></div>
          <p className="text-xs text-vsecondary">
            +19% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
