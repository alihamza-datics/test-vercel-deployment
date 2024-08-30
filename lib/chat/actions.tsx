// @ts-nocheck
// 'use server'
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  createStreamableValue
} from 'ai/rsc'

import { BotCard, BotMessage } from '@/components/stocks'

import { nanoid, sleep } from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat } from '../types'
// import { auth } from '@/auth'
import { FlightStatus } from '@/components/flights/flight-status'
import { SelectSeats } from '@/components/flights/select-seats'
import { ListFlights } from '@/components/flights/list-flights'
import { BoardingPass } from '@/components/flights/boarding-pass'
import { PurchaseTickets } from '@/components/flights/purchase-ticket'
import { CheckIcon, SpinnerIcon } from '@/components/ui/icons'
import { format } from 'date-fns'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import { ListHotels } from '@/components/hotels/list-hotels'
import { Destinations } from '@/components/flights/destinations'
import { Video } from '@/components/media/video'
import { rateLimit } from './ratelimit'
import { Offers } from '@/components/offers/offers'
import { OfferSkeleton } from '@/components/offerSkeleton/offerSkeleton'
import MyBarChart from '@/components/offers/barChart'
import ApexBarChart, { MyBarChart1 } from '@/components/offers/apexBarChart'
import { BarChartSkeleton } from '@/components/barChartSkeleton/barChartSkeleton'
import {
  generateSQLQuery,
  showData,
  triggerShowDataTool
} from './toolDefinition'
import { LanguageModelV1 } from '@ai-sdk/provider'
import prisma from '../db/prisma'

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
)
const instructions = `
      You are an AI assistant designed to help users interact with their databases by generating SQL queries based on the database schema.

guess the db schema
First generateSQLQuery than call next tool automatically e.g showData
      `

export async function getColumnNames(rows) {
  if (rows.length === 0) {
    return []
  }
  return Object.keys(rows[0])
}

export async function formatResultRows(result) {
  if (result.rows.length > 0) {
    const columnNames = Object.keys(result.rows[0])

    const columnHeader = columnNames.join(', ')
    const rowsString = result.rows
      .map(row =>
        Object.entries(row)
          .map(([key, value]) => `${key}=${value}`)
          .join(', ')
      )
      .join('\n')

    const resultString = `${columnHeader}\n${rowsString}`

    return resultString
  } else {
    return 'No rows available.'
  }
}

async function submitUserMessage(content, chatId) {
  'use server'

  console.log(
    'Starting submitUserMessage with content:',
    content,
    'and chatId:',
    chatId
  )
  let savedThread
  const title = content?.substring(0, 100)

  if (!chatId) {
    try {
      savedThread = await prisma.threads.create({
        data: {
          userId: 1,
          title: title,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log('Thread created:', savedThread)
    } catch (error) {
      console.error('Error creating thread:', error)
      throw new Error('Failed to create thread')
    }
  }

  const aiState = getMutableAIState()
  const threadId = savedThread?.id || chatId

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content: `${aiState.get().interactions.join('\n\n')}\n\n${content}`
      }
    ],
    chatId: threadId
  })

  const history = aiState.get().messages.map(message => ({
    role: message.role,
    content: message.content
  }))

  const textStream = createStreamableValue('')
  const spinnerStream = createStreamableUI(<SpinnerMessage />)
  const messageStream = createStreamableUI(null)
  const uiStream = createStreamableUI()

  console.log('Before processing messages...')

  try {
    const result = await streamText({
      model: openai('gpt-4-turbo') as unknown as LanguageModelV1,
      temperature: 0,
      maxToolRoundtrips: 5,
      tools: {
        generateSQLQuery: {
          description: "Generates an SQL query based on the user's input.",
          parameters: z.object({
            query: z.string().describe("The user's query to convert into SQL.")
          })
        }
      },
      system: instructions,
      messages: [...history]
    })

    let textContent = ''
    let isSpinner = true

    for await (const delta of result.fullStream) {
      const { type, finishReason } = delta
      if (type === 'finish' && finishReason === 'stop') {
        aiState.update({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content: textContent
            }
          ]
        })
        console.log('Processing finished:', textContent)
      }
      if (type === 'text-delta') {
        if (isSpinner) {
          spinnerStream.done(null)
        }
        isSpinner = false
        const { textDelta } = delta
        textContent += textDelta

        messageStream.update(<BotMessage id={threadId} content={textContent} />)
      } else if (type === 'tool-call') {
        const { toolName, args } = delta
        if (toolName === 'generateSQLQuery') {
          const sqlQuery = await generateSQLQuery({ args, aiState })
          const showDataResult = await triggerShowDataTool({
            sqlQuery: sqlQuery
          })

          for await (const delta of showDataResult.fullStream) {
            const { type } = delta
            if (type === 'text-delta') {
              const { textDelta } = delta
              textContent += textDelta
              messageStream.update(
                <BotMessage id={threadId} content={textContent} />
              )
            } else if (type === 'tool-call') {
              const { toolName, args } = delta
              if (toolName === 'showData') {
                const showDataResult = await showData({
                  args,
                  aiState,
                  uiStream
                })
              }
            }
          }
        }
      }
    }

    uiStream.done()
    textStream.done()
    messageStream.done()
  } catch (e) {
    console.error('Error during processing:', e)
    const error = new Error(e)
    uiStream.error(error)
    textStream.error(error)
    messageStream.error(error)
    aiState.done()
  }

  console.log('Returning from submitUserMessage with threadId:', threadId)

  return {
    id: threadId,
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value
  }
}

async function triggerShowDataToolAction(sqlQuery: string) {
  'use server'
  const textStream = createStreamableValue('')
  const spinnerStream = createStreamableUI(<SpinnerMessage />)
  const messageStream = createStreamableUI(null)
  const uiStream = createStreamableUI()
  const aiState = getMutableAIState()
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content: `${aiState.get().interactions.join('\n\n')}\n\n Show data for SQL Query: ${sqlQuery}`
      }
    ]
  })
  try {
    const result = await triggerShowDataTool({ sqlQuery })
    for await (const delta of result.fullStream) {
      const { type } = delta
      if (type === 'text-delta') {
        const { textDelta } = delta

        textContent += textDelta
        messageStream.update(<BotMessage content={textContent} />)

        aiState.update({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content: textContent
            }
          ]
        })
      } else if (type === 'tool-call') {
        const { toolName, args } = delta
        if (toolName === 'showData') {
          spinnerStream.done(null)
          const showData1 = await showData({
            args,
            aiState,
            uiStream
          })
        }
      }
    }
    uiStream.done()
    textStream.done()
    messageStream.done()
  } catch (error) {
    uiStream.error(error)
    textStream.error(error)
    messageStream.error(error)
    aiState.done()
  }
  return {}
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id?: string
  name?: string
  display?: {
    name: string
    props: Record<string, any>
  }
}

export type AIState = {
  chatId: number
  interactions?: string[]
  messages?: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
  spinner?: React.ReactNode
  attachments?: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    triggerShowDataToolAction
  },
  initialUIState: [],
  initialAIState: { chatId: null, interactions: [], messages: [] },
  onGetUIState: async () => {
    'use server'

    // const session = await auth()

    // if (session && session.user) {
    const aiState = getAIState()

    if (aiState) {
      const uiState = getUIStateFromAIState(aiState)
      return uiState
    }
    // } else {
    //   return
    // }
  },
  onSetAIState: async ({ state }) => {
    'use server'
    // const session = await auth()

    // if (session && session.user) {
    const { chatId, messages } = state

    const messagesList = [messages[messages.length - 1]]
    const chat: Chat = {
      id: chatId,
      messages: messagesList
    }
    if (messagesList?.length > 0) {
      await saveChat(chat)
    }
    // } else {
    //   return
    // }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => {
      const {
        sqlQuery,
        assumptions,
        explanation,
        typeOfChart,
        xAxisProperty,
        yAxisProperty,
        data
      } = message?.display?.props || {}
      const generativeUI = {
        id: `${aiState.chatId}-${index}`,
        display:
          message.role === 'assistant' ? (
            message.display?.name === 'showData' ? (
              <BotCard>
                <Offers
                  data={data || []}
                  assumptions={assumptions}
                  explanation={explanation}
                  query={sqlQuery}
                  typeOfChart={typeOfChart}
                  xAxisProperty={xAxisProperty}
                  yAxisProperty={yAxisProperty}
                />
              </BotCard>
            ) : (
              <BotMessage content={message.content} />
            )
          ) : message.role === 'user' ? (
            <UserMessage showAvatar>{message.content}</UserMessage>
          ) : (
            <BotMessage content={message.content} />
          )
      }
      return generativeUI
    })
}
