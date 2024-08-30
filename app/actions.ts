'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

// import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import prisma from '@/lib/db/prisma'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const threads = await prisma.threads.findMany({
      include: {
        messages: true,
      },
    });

    return threads;

  } catch (error) {
    throw new Error(error)
  }
}

export async function getChat(id: any, userId: any) {
  try {

    const chat = await prisma.threads.findUnique({
      where: { id, userId },
      include: {
        messages: true,
      },
    });

    if (!chat || (userId && chat.userId !== userId)) {
      return null
    }

    const parsedChat = {
      ...chat,
      messages: chat.messages.map(message => {
        // console.log('here display', message.display)
        const data = {
          ...message,
          display: JSON.parse(message.display),
        }
        return data
      }),
    }

    return parsedChat
  } catch (error) {
    console.log('here get chat error', error)
    throw new Error(error)
  }
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  // const session = await auth()

  // if (!session) {
  //   return {
  //     error: 'Unauthorized'
  //   }
  // }

  //Convert uid to string for consistent comparison with session.user.id
  const uid = String(await kv.hget(`chat:${id}`, 'userId'))

  // if (uid !== session?.user?.id) {
  //   return {
  //     error: 'Unauthorized'
  //   }
  // }

  await kv.del(`chat:${id}`)
  // await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  // const session = await auth()

  // if (!session?.user?.id) {
  //   return {
  //     error: 'Unauthorized'
  //   }
  // }

  // const chats: string[] = await kv.zrange(`user:chat:${session.user.id}`, 0, -1)
  // if (!chats.length) {
  //   return redirect('/')
  // }
  // const pipeline = kv.pipeline()

  // for (const chat of chats) {
  //   pipeline.del(chat)
  //   pipeline.zrem(`user:chat:${session.user.id}`, chat)
  // }

  // await pipeline.exec()

  // revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(id: string) {
  // const session = await auth()

  // if (!session?.user?.id) {
  //   return {
  //     error: 'Unauthorized'
  //   }
  // }

  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat) {
    return {
      error: 'Something went wrong'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hmset(`chat:${chat.id}`, payload)

  return payload
}

export async function saveChat(chat: Chat) {
  // const session = await auth()

  // if (session && session.user) {
  try {
    const savedMessages = await Promise.all(
      chat.messages.map(message =>
        prisma.messages.create({
          data: {
            role: message.role,
            content: message?.content,
            display: JSON.stringify(message?.display),
            createdAt: new Date(),
            updatedAt: new Date(),
            threadId: chat?.id
          }
        })
      ))

  } catch (error) {
    throw new Error(error)
  }

  // } else {
  //   return
  // }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ['GOOGLE_GENERATIVE_AI_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}
