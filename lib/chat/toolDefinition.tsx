import { Offers } from '@/components/offers/offers'
import { BotCard } from '@/components/stocks'
import { streamText } from 'ai'
import { nanoid } from '@/lib/utils'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import prisma from '@/lib/db/prisma'
import { Prisma } from '@prisma/client'
import { LanguageModelV1 } from '@ai-sdk/provider'
import { closeDBConnection, getDBConnection } from '../db/mssqlDb'
import fs from 'fs'

export const showData = async ({ args, aiState, uiStream }) => {
  const {
    sqlQuery,
    assumptions,
    explanation,
    typeOfChart,
    xAxisProperty,
    yAxisProperty
  } = args

  console.log(
    'here ----------',
    'showData',
    assumptions,
    explanation,
    typeOfChart,
    xAxisProperty,
    yAxisProperty
  )
  console.log('properties:', xAxisProperty, yAxisProperty, sqlQuery)

  uiStream.update(
    <BotCard>
      <Offers
        isDataLoading
        assumptions={assumptions}
        explanation={explanation}
        query={sqlQuery}
        typeOfChart={typeOfChart}
      />
    </BotCard>
  )
  const pool = await getDBConnection()
  let result
  try {
    const request = pool.request()
    result = await request.query(sqlQuery)
    // result = await prisma.$queryRaw`${Prisma.raw(sqlQuery)}`
  } catch (error) {
    console.log(error)
  } finally {
    await closeDBConnection()
    // const result = await prisma.$queryRaw`${Prisma.raw(sqlQuery)}`
    uiStream.update(
      <BotCard>
        <Offers
          data={result?.recordset || []}
          assumptions={assumptions}
          explanation={explanation}
          query={sqlQuery}
          typeOfChart={typeOfChart}
          xAxisProperty={xAxisProperty}
          yAxisProperty={yAxisProperty}
        />
      </BotCard>
    )

    const props = { ...args, data: result?.recordset }
    aiState.done({
      ...aiState.get(),
      interactions: [],
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'assistant',
          content: '',
          display: {
            name: 'showData',
            props: props
          }
        }
      ]
    })
  }
}

export const generateSQLQuery = async ({ args, aiState }) => {
  const { query } = args
  const vannaRes = await fetchSQLQuery({ query })
  let sqlQuery = vannaRes?.text
  const sqlKeywords = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'CREATE',
    'DROP',
    'ALTER'
  ]
  const isSQLQuery = sqlKeywords.some(keyword =>
    query?.toUpperCase().includes(keyword)
  )
  const isVannaSQLQuery = sqlKeywords.some(keyword =>
    sqlQuery?.toUpperCase().includes(keyword)
  )
  if (isSQLQuery && !isVannaSQLQuery) {
    sqlQuery = query
  }

  console.log('here------', 'generateSQLQuery', sqlQuery)

  return sqlQuery
}

export const triggerShowDataTool = async ({ sqlQuery }) => {
  'use client'
  return await streamText({
    model: openai('gpt-4-turbo') as unknown as LanguageModelV1,
    // maxToolRoundtrips: 5,
    // toolChoice: { type: 'tool', toolName: 'showData' },
    tools: {
      showData: {
        description:
          'Displays data based on the SQL query provided by generateSQLQuery.',
        parameters: z.object({
          sqlQuery: z.string().describe('The SQL query used to fetch data.'),
          assumptions: z.string().describe('Assumptions made for SQL query.'),
          explanation: z
            .string()
            .describe('Explanation of what the SQL query does.'),
          typeOfChart: z
            .string()
            .describe(
              'Enum to define what type of chart would represent this sql query data better. Based on the sql query possible values are bar, pie, line, none'
            ),
          xAxisProperty: z
            .string()
            .describe(
              'If typeOfChart is bar then tell us which property will better be shown on x axis.'
            ),
          yAxisProperty: z
            .string()
            .describe(
              'If typeOfChart is bar then tell us which property will better be shown on y axis.'
            )
          // query: z.string().describe('The query the user typed')
        })
      }
    },
    messages: [
      {
        role: 'user',
        content: `Show data for SQL Query: ${sqlQuery}`
      }
    ]
  })
}

const fetchSQLQuery = async ({ query }) => {
  const apiUrl = `${process.env.VANNA_BASE_URL}/api/v0/generate_sql?question=${query}`

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching SQL query:', error)
  }
}
