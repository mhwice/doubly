import { BarChart2 } from "lucide-react"

interface propppy {
  title: string,
  data: {
    title: string,
    count: number,
    percent: number,
  }[]
}

export function TabStuff(params: propppy) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{params.title}</h2>
        <BarChart2 className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        {params.data.map(({ title, count, percent }) => {
          return (
            <div key={`${title},${count}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{title}</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${percent}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
