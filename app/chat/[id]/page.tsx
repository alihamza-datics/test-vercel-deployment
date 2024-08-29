// @ts-nocheck
import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

// import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  // const session = await auth()

  // if (!session?.user) {
  //   return {}
  // }
  // session.user.id
  const userId = 1 // make it dynamic
  const chat = await getChat(Number(params.id), userId)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export default async function ChatPage({ params }: ChatPageProps) {
  // const session = (await auth()) as Session

  // if (!session?.user) {
  //   redirect(`/login?next=/chat/${params.id}`)
  // }

  // const userId = session.user.id as string // make it dynamic
  const userId = 1 // make it dynamic
  const chat = await getChat(Number(params.id), userId)
  // console.log('here chat', chat)
  // console.log('here chat', chat)
  // if (!chat) {
  //   redirect('/')
  // }

  if (chat?.userId !== 1) {
    notFound()
  }

  return (
    <>
      {/* <div className="bg-muted">
        <h3>Chat AI</h3>
      </div> */}
      <AI
        initialAIState={{
          chatId: chat.id,
          messages: chat.messages,
          interactions: []
        }}
      >
        <Chat id={chat.id} initialMessages={chat?.messages} />
      </AI>
    </>
  )
}
