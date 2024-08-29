'use client'

import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ListFlights } from '@/components/flights/list-flights'
import { ListHotels } from '@/components/hotels/list-hotels'
import { Message } from '@/lib/chat/actions'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { cn } from '@/lib/utils'
import { useAIState, useUIState } from 'ai/rsc'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSidebar } from '@/lib/hooks/use-sidebar'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, className }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [input, setInput] = useState('')
  const [messages] = useUIState()
  const [aiState] = useAIState()
  const { isSidebarOpen } = useSidebar()
  // const [_, setNewChatId] = useLocalStorage('newChatId', '1')

  // useEffect(() => {
  //   if (session?.user) {
  //     if (!path.includes('chat') && messages.length === 1) {
  //       window.history.replaceState({}, '', `/chat/${id}`)
  //     }
  //   }
  // }, [id, path, session?.user, messages])

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [aiState.messages, router])

  // useEffect(() => {
  //   setNewChatId(id)
  // })

  // useEffect(() => {
  //   missingKeys.map(key => {
  //     toast.error(`Missing ${key} environment variable!`)
  //   })
  // }, [missingKeys])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className={`max-h-[85vh] duration-300 ease-in-out p-0 size-full bg-white border-r bg-muted overflow-auto peer-[[data-state=open]] peer-[[data-state=open]] group ${
        !messages.length ? ' bg-muted flex flex-col min-h-[85.5vh]' : ''
      }`}
      ref={scrollRef}
    >
      <div className={cn(' pt-4', className)} ref={messagesRef}>
        {messages.length ? (
          <ChatList messages={messages} isShared={false} />
        ) : (
          <EmptyScreen />
        )}
        {/* <div className=" w-full" ref={visibilityRef} /> */}
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        isEmptyScreen={!messages?.length}
      />
    </div>
  )
}
