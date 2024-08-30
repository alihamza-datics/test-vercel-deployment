// @ts-nocheck
import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { unstable_noStore as noStore } from 'next/cache'
// import { auth } from '@/auth'
// import { Session } from '@/lib/types'
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'The Cosmic AI Platform Chat'
}

export default async function IndexPage() {
  noStore()
  // const session = (await auth()) as Session

  return (
    <AI initialAIState={{ chatId: null, interactions: [], messages: [] }}>
      <Chat />
    </AI>
  )
}
