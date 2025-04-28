import { ScrollArea } from "@/components/ui/scroll-area"
import { MousePointerClickIcon } from "lucide-react"
import { cleanUrl } from "../links/components/columns";

interface propppy {
  title: string,
  data: {
    value: string,
    count: number,
    percent: number,
  }[]
}

export function TabStuff(params: propppy) {
  return (
    <div className="bg-white border rounded-[var(--bradius)] border-vborder mb-14 py-4">
      <div className="flex items-center justify-between mb-3 px-4">
        <h2 className="text-2xl font-semibold tracking-tight text-vprimary">{params.title}</h2>
        <MousePointerClickIcon className="h-4 w-4 text-vsecondary" />
      </div>
      <ScrollArea className="h-[350px] relative px-4">
        <div className="w-full h-4"></div>
        <div className="absolute top-0 left-0 right-2 h-7 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-2 h-7 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        <div className="h-1"></div>
        <div className="space-y-6">
          {params.data.map(({ value, count, percent }) => {
            return (
              <div key={`${value},${count}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-vprimary">{cleanUrl(value)}</span>
                  </div>
                  <span className="text-sm text-vprimary">{count} <span className="text-xs font-mono font-thin text-vsecondary">({Math.round(percent)}%)</span></span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--database)] rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })}
          <div className="h-1"></div>
        </div>
      </ScrollArea>
    </div>
  )
}
