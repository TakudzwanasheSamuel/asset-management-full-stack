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
  available: {
    label: "Available",
    color: "hsl(var(--chart-1))",
  },
  checkedOut: {
    label: "Checked Out",
    color: "hsl(var(--chart-2))",
  },
}

export function AssetStatusDistributionChart() {
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
    fetch(`/api/charts/asset-status-over-time?company_id=${companyId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setChartData(data)
      })
  }, [companyId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Status Over Time</CardTitle>
        <CardDescription>
          Available vs. Checked Out assets in the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="available"
              type="monotone"
              stroke="var(--color-available)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="checkedOut"
              type="monotone"
              stroke="var(--color-checkedOut)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
