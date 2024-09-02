import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ClipboardIcon } from 'lucide-react'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  isEmptyScreen: boolean
}
export const exampleMessages = [
  {
    icon: <ClipboardIcon style={{ color: '#8900A0' }} />,
    heading: 'Top Customer Engagement',
    subheading: 'Top 10 Customers by Website Visits',
    message: `Fetch the top 10 customers which are present and the amount they have paid in their respective transactions.`
  },
  {
    icon: <ClipboardIcon style={{ color: '#8900A0' }} />,
    heading: 'Invoice Details',
    subheading: 'Top 5 Invoices Overview',
    message:
      'Obtain details of the top 5 invoices including their document numbers, customer names, and status.'
  },
  {
    icon: <ClipboardIcon style={{ color: '#8900A0' }} />,
    heading: 'Transaction Summary',
    subheading: 'Top 20 Transactions Payment Methods',
    message:
      'List the customers and their payment methods for the top 20 transactions.'
  },
  {
    icon: <ClipboardIcon style={{ color: '#8900A0' }} />,
    heading: 'Profit Analysis',
    subheading: 'Invoices with High Gross Profit',
    message:
      'List the first 15 invoices where the estimated gross profit is greater than $5000 and customer is present.'
  }
]

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  isEmptyScreen
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const chatId = id || ''
  const router = useRouter()
  return (
    <div className=" inset-x-0 duration-300 ease-in-out dark:from-10% ">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-[800px] sm:px-4">
        <div className="grid sm:grid-cols-2 gap-2 sm:gap-4 px-4 sm:px-0 max-w-[700px] mb-[60px]">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={cn(
                  'flex flex-col items-center  cursor-pointer bg-white text-zinc-950 rounded-2xl border p-4 sm:p-6 hover:bg-zinc-100 shadow-md transition-colors',
                  index > 1 && 'hidden md:block'
                )}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  try {
                    const responseMessage = await submitUserMessage(
                      example.message,
                      chatId
                    )
                    // setTimeout(
                    //   () => router.push(`/chat/${responseMessage.id}`),
                    //   15000
                    // )

                    if (responseMessage?.id) {
                      // const newUrl = `/chat/${responseMessage?.id}`;
                      // const linkUpdate = window.history.replaceState(null, '', newUrl);
                      // router.push(`/chat/${responseMessage.id}`)
                    }

                    setMessages(currentMessages => [
                      ...currentMessages,
                      responseMessage
                    ])
                  } catch {
                    toast(
                      <div className="text-red-600">
                        You have reached your message limit! Please try again
                        later, or{' '}
                        <a
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://vercel.com/templates/next.js/gemini-ai-chatbot"
                        >
                          deploy your own version
                        </a>
                        .
                      </div>
                    )
                  }
                }}
              >
                <div className="font-medium">{example.icon}</div>
                <div className="font-medium pt-2">{example.heading}</div>
                <div className="text-sm text-zinc-800 pt-2">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        <div
          className={clsx(
            'grid gap-4 sm:pb-4 sm-px-2 ',
            !isEmptyScreen && 'relative bottom-0 animate-slide-up'
          )}
        >
          <PromptForm
            chatType={messages.length}
            input={input}
            setInput={setInput}
            id={id}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
