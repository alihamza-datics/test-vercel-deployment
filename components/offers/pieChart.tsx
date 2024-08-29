import dynamic from 'next/dynamic'
import React from 'react'
import { ApexOptions } from 'apexcharts'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const PieChart = ({ series, labels }) => {
  const options: ApexOptions = {
    chart: {
      type: 'pie'
    },
    labels: labels,
    title: {
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold'
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  }

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="pie" />
    </div>
  )
}

export default PieChart
