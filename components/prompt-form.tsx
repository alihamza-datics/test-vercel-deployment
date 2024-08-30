'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function PromptForm({
  input,
  setInput,
  chatType,
  id
}: {
  input: string
  setInput: (value: string) => void
  chatType: any
  id: any
}) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage, describeImage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const fileRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  return (
    <form
      className="form"
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])
        const chatId = id || ''
        try {
          // Submit and get response message
          const responseMessage = await submitUserMessage(value, chatId)
          // setTimeout(() => router.push(`/chat/${responseMessage.id}`), 2000)

          setMessages(currentMessages => [...currentMessages, responseMessage])
        } catch (e) {
          // toast(<div className="text-red-600">{e.message}</div>)
          throw new Error(e)
        }
      }}
    >
      <style jsx>{`
        form {
          display: flex;
          align-items: center;
          width: 700px;
          margin: 0;
        }

        @media (max-width: 800px) {
          form {
            width: auto;
            margin: 10px;
          }
        }
      `}</style>
      <input
        type="file"
        className="hidden"
        id="file"
        ref={fileRef}
        onChange={async event => {
          if (!event.target.files) {
            toast.error('No file selected')
            return
          }

          const file = event.target.files[0]

          if (file.type.startsWith('video/')) {
            const responseMessage = await describeImage('')
            setMessages(currentMessages => [
              ...currentMessages,
              responseMessage
            ])
          } else {
            const reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onloadend = async () => {
              const base64String = reader.result
              const responseMessage = await describeImage(base64String)
              setMessages(currentMessages => [
                ...currentMessages,
                responseMessage
              ])
            }
          }
        }}
      />
      <div
        style={{
          marginLeft: chatType == 0 ? '0' : '15px'
        }}
        className=" flex max-h-40 w-full grow flex-col overflow-hidden bg-zinc-100  rounded-xl border sm-w-auto"
      >
        {/* <Tooltip>
          <TooltipTrigger asChild> */}
        {/* <Button
          variant="outline"
          size="icon"
          className=" left-4 top-[14px] size-8 rounded-[10px] bg-background p-0 sm:left-4"
          onClick={() => {
            fileRef.current?.click()
          }}
        >
          <IconPlus />
          <span className="sr-only">New Chat</span>
        </Button> */}
        {/* </TooltipTrigger>
          <TooltipContent>Add Attachments</TooltipContent>
        </Tooltip> */}
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className=" w-full bg-transparent placeholder:text-zinc-900 resize-none p-4 focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className=" right-4 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild></TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={input === ''}
        className="bg-transparent shadow-none text-zinc-950 hover:bg-zinc-200 ml-2"
      >
        <IconArrowElbow className="size-[40px] rounded-[5px] bg-[#8900A0] text-white" />
        {/* <span className="sr-only">Send message</span> */}
      </Button>
    </form>
  )
}
