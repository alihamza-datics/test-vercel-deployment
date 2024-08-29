import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function BarChartSkeleton() {
  return (
    <div>
      <div className="flex flex-col h-[300px] justify-between">
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-end h-full">
            <div className="w-[50px] bg-muted h-4/5 rounded-t-lg animate-pulse" />
            <div className="w-[50px] bg-muted h-3/5 rounded-t-lg animate-pulse" />
            <div className="w-[50px] bg-muted h-[90%] rounded-t-lg animate-pulse" />
            <div className="w-[50px] bg-muted h-[70%] rounded-t-lg animate-pulse" />
            <div className="w-[50px] bg-muted h-[50%] rounded-t-lg animate-pulse" />
            <div className="w-[50px] bg-muted h-3/4 rounded-t-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
