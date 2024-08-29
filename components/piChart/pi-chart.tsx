"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Original chart data
const chartData = [
  { browser: "NewCustomers", visitors: 275, fill: "var(--color-NewCustomers)" },
  { browser: "FrequentCustomers", visitors: 200, fill: "var(--color-FrequentCustomers)" },
  { browser: "IdleUsers", visitors: 187, fill: "var(--color-IdleUsers)" },
  { browser: "CartAbandoners", visitors: 173, fill: "var(--color-CartAbandoners)" },
]

// Dynamically generating chartConfig
const chartConfig = chartData.reduce((config, item) => {
  const percentage = ((item.visitors / chartData.reduce((sum, data) => sum + data.visitors, 0)) * 100).toFixed(1);
  return {
    ...config,
    [item.browser]: {
      label: `${percentage}%`,
      color: `hsl(var(--chart-${chartData.indexOf(item) + 1}))`,
    },
  };
}, {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig);



export function PiChartLayout() {
  return (
    <div className="flex flex-col">
      <CardContent className="flex-1 pb-0">
      <div className="block xl:flex items-center">
          <div className="w-full w-xl-[40%]">
            <ul className="list-none">
              {chartData.map((item, index) => (
                <li key={index} className="mb-2">
                  <span
                    className="inline-block size-4 mr-2 rounded-full"
                    style={{ backgroundColor: `hsl(var(--chart-${chartData.indexOf(item) + 1}))` }}                  
                    ></span>
                    <b>{item.browser.replace(/([A-Z])/g, ' $1').trim()}</b>
                    <p>{chartConfig[item.browser as keyof typeof chartConfig].label}, which is {item.visitors} visitors</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full w-xl-[60%]">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="visitors" hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius}) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize={12}
                      >
                      </text>
                    );
                  }}
                >
                  <LabelList
                    dataKey="browser"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: keyof typeof chartConfig) =>
                      chartConfig[value]?.label
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
