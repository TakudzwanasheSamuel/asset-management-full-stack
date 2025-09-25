"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  laptops: {
    label: "Laptops",
    color: "hsl(var(--chart-1))",
  },
  monitors: {
    label: "Monitors",
    color: "hsl(var(--chart-2))",
  },
  phones: {
    label: "Phones",
    color: "hsl(var(--chart-3))",
  },
}

export function AssetTypeDistributionChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/employees/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (user && user.company_id) {
          setCompanyId(user.company_id)
        }
      })
  }, [])

  useEffect(() => {
    if (!companyId) return
    fetch(`/api/charts/asset-growth-by-type?company_id=${companyId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setChartData(data)
      })
  }, [companyId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Growth by Type</CardTitle>
        <CardDescription>
          Number of assets by type over the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="laptops"
              type="monotone"
              stroke="var(--color-laptops)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="monitors"
              type="monotone"
              stroke="var(--color-monitors)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="phones"
              type="monotone"
              stroke="var(--color-phones)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
