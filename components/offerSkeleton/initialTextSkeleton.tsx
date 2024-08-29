import { Skeleton } from '@/components/ui/skeleton'

export function InitialTextSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-[180px]" />
        <Skeleton className="h-4 w-[280px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-[220px]" />
        <Skeleton className="h-4 w-[320px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-[190px]" />
        <Skeleton className="h-4 w-[290px]" />
      </div>
    </div>
  )
}
