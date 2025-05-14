import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  QrCodeIcon,
  LinkIcon,
  MousePointerClickIcon
} from "lucide-react"

import NumberFlow from '@number-flow/react'
import { Skeleton } from "@/components/ui/skeleton";

interface StatsHeaderProps {
  stats: {
    numLinks: number,
    linkClicks: number,
    qrClicks: number
  } | undefined
}

export function StatsHeader({ stats }: StatsHeaderProps) {

  return (
    <div className="grid sm:gap-4 gap-2 grid-cols-3 h-[120px]">
      <Card className="rounded-[var(--bradius)] shadow-none border-vborder h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vprimary">
            Urls
          </CardTitle>
          <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 text-vsecondary" />
        </CardHeader>
        <CardContent>
          {stats ? <div className="text-2xl font-bold"><NumberFlow value={stats.numLinks}/></div> : <Skeleton className="w-10 h-10"/>}
          {/* <p className="text-xs text-vsecondary">
            +20.1% from last month
          </p> */}
        </CardContent>
      </Card>
      <Card className="rounded-[var(--bradius)] shadow-none border-vborder">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vprimary">
            <span className="hidden sm:block">Link Clicks</span>
            <span className="block sm:hidden">Clicks</span>
          </CardTitle>
          <MousePointerClickIcon className="h-3 w-3 sm:h-4 sm:w-4 text-vsecondary" />
        </CardHeader>
        <CardContent>
          {/* <div className="text-2xl font-bold text-vprimary"><NumberFlow value={linkClicks} /></div> */}
          {stats ? <div className="text-2xl font-bold text-vprimary"><NumberFlow value={stats.linkClicks} /></div> : <Skeleton className="w-10 h-10"/>}
          {/* <p className="text-xs text-vsecondary">
            +180.1% from last month
          </p> */}
        </CardContent>
      </Card>
      <Card className="rounded-[var(--bradius)] shadow-none border-vborder">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-vprimary">
          <span className="hidden sm:block">QR Scans</span>
          <span className="block sm:hidden">Scans</span>
          </CardTitle>
          <QrCodeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-vsecondary"/>
        </CardHeader>
        <CardContent>
          {/* <div className="text-2xl font-bold text-vprimary"><NumberFlow value={qrClicks} /></div> */}
          {stats ? <div className="text-2xl font-bold text-vprimary"><NumberFlow value={stats.qrClicks} /></div> : <Skeleton className="w-10 h-10"/>}
          {/* <p className="text-xs text-vsecondary">
            +19% from last month
          </p> */}
        </CardContent>
      </Card>
    </div>
  );
}
