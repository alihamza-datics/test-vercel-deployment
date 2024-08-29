import * as React from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'
import { SidebarList } from '@/components/sidebar-list'
import { buttonVariants } from '@/components/ui/button'
import { IconPlus } from '@/components/ui/icons'

interface ChatHistoryProps {
  userId?: string
}

export function ChatHistory({ userId }: ChatHistoryProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        {/* <div><h4 className="text-sm font-medium">Chat History</h4></div>  */}
        <div className="flex">
          <Link href="/chat">
            <IconPlus className="size-[30px] p-1 bg-[#8900A0] text-white rounded-full" />
          </Link>
        </div>
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-lg shrink-0 animate-pulse bg-zinc-200"
              />
            ))}
          </div>
        }
      >
        {/* @ts-ignore */}
        <SidebarList userId={userId} />
      </React.Suspense>
    </div>
  )
}
