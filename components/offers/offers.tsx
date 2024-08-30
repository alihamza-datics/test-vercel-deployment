'use client'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import {
  Table as UITable,
  TableHeader,
  TableHead,
  TableBody
  // TableCell
} from '@/components/ui/table'
import Link from 'next/link'
import { LinkToURL } from './link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useRef } from 'react'
import { MyTable } from '../table/table'
import { OfferTableSkeleton } from '../offerSkeleton/offerSkeleton'
import { InitialTextSkeleton } from '../offerSkeleton/initialTextSkeleton'
import ApexBarChart from './apexBarChart'
import { BarChartSkeleton } from '../barChartSkeleton/barChartSkeleton'
import { SparklesIcon } from '../ui/icons'
import { useActions, useUIState } from 'ai/rsc'

import CodeBlock from './codeBlock'
import { exampleMessages } from '../chat-panel'
import PieChart from './pieChart'
import { downloadDocument } from './helpers'

export function Offers({
  data = [],
  assumptions,
  explanation,
  query,
  isLoading = false,
  isDataLoading = false,
  typeOfChart,
  yAxisProperty = '',
  xAxisProperty = ''
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredData = data?.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm?.toLowerCase())
    )
  )
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState()
  const chartRef = useRef(null)
  const pieChartRef = useRef(null)

  const handleSearch = e => {
    setSearchTerm(e.target.value)
  }

  const handlePageChange = page => {
    setCurrentPage(page)
  }
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const cleanedXAxisProperty = xAxisProperty?.replace('::date', '')
  const cleanedYAxisProperty = yAxisProperty?.replace('::date', '')
  const series = data?.map(row => Number(row[cleanedYAxisProperty]))

  const labels = data?.map(row =>
    new Date(row[cleanedXAxisProperty]).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })
  )

  return (
    <div className="max-w-[650px] xs:w-[220px]">
      {isLoading ? (
        <InitialTextSkeleton />
      ) : (
        <div className="space-y-4">
          {query && <CodeBlock query={query} />}
          {assumptions && (
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Assumptions</h2>
              <p className="text-muted-foreground">{assumptions}</p>
            </div>
          )}
          {explanation && (
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Explanation</h2>
              <p className="text-muted-foreground">{explanation}</p>
            </div>
          )}
        </div>
      )}

      {(typeOfChart === 'bar' || typeOfChart === 'none') && isDataLoading ? (
        <OfferTableSkeleton />
      ) : (
        (typeOfChart === 'none' || typeOfChart === 'bar') && (
          <div className="space-y-4 pace-y-4 mt-4">
            <MyTable
              filteredData={filteredData}
              searchTerm={searchTerm}
              handleSearch={handleSearch}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )
      )}
      {typeOfChart === 'bar' && isDataLoading ? (
        <BarChartSkeleton />
      ) : (
        data?.length > 0 &&
        typeOfChart === 'bar' && (
          <>
            <div className="mt-10 mb-2">
              <h2 className="text-xl font-bold">
                Comparison of Data Across Categories
              </h2>
            </div>

            <div ref={chartRef}>
              <ApexBarChart data={data} labels={labels} series={series} />
            </div>
          </>
        )
      )}
      {typeOfChart === 'bar' && isDataLoading ? (
        <BarChartSkeleton /> // use piechart skeleton
      ) : (
        series?.length > 0 &&
        typeOfChart === 'bar' && (
          <>
            <div className="mt-10 mb-2">
              <h2 className="text-xl font-bold">Proportional Share of Data</h2>
            </div>

            <div ref={pieChartRef}>
              <PieChart series={series} labels={labels} />
            </div>
          </>
        )
      )}
      <Button
        onClick={() =>
          downloadDocument({
            typeOfChart,
            query,
            assumptions,
            explanation,
            filteredData,
            chartRef,
            pieChartRef
          })
        }
        className="w-full mt-4 bg-[#8900A0] text-white hover:bg-[#8900A0]rounded-lg py-2 px-4 flex items-center justify-center transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mr-2"
        >
          <path d="M4.5 2h15a1.5 1.5 0 0 1 1.5 1.5v17a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20.5V3.5A1.5 1.5 0 0 1 4.5 2zM5 4v16h14V4H5zm2 3h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" />
        </svg>
        Download Response
      </Button>
      {/* <div className="flex flex-col sm:flex-row items-start gap-2 mt-6">
        {exampleMessages.map((suggestion, index) => (
          <button
            key={suggestion.subheading + index + 1}
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-xl cursor-pointer"
            onClick={async () => {
              const response = await submitUserMessage(suggestion.message, [])
              setMessages((currentMessages: any[]) => [
                ...currentMessages,
                response
              ])
            }}
          >
            <SparklesIcon />
            {suggestion.subheading}
          </button>
        ))}
      </div> */}
    </div>
  )
}
