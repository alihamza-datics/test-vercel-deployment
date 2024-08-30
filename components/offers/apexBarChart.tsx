'use client'
import dynamic from 'next/dynamic'
import React from 'react'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ApexBarChart = ({ data, labels, series }) => {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: labels
    },
    yaxis: {
      title: {
        text: ''
      }
    },
    fill: {
      opacity: 1
    }
  }

  const seriesList = [
    {
      name: 'Offers Created',
      data: series
    }
  ]

  return <Chart options={options} series={seriesList} type="bar" height={350} />
}

export default ApexBarChart
