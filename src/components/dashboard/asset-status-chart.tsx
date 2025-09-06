"use client"

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

const chartData = [
  { month: "Jan", available: 520, checkedOut: 110 },
  { month: "Feb", available: 550, checkedOut: 120 },
  { month: "Mar", available: 570, checkedOut: 130 },
  { month: "Apr", available: 620, checkedOut: 115 },
  { month: "May", available: 780, checkedOut: 140 },
  { month: "Jun", available: 890, checkedOut: 152 },
]


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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Status Over Time</CardTitle>
        <CardDescription>Available vs. Checked Out assets in the last 6 months.</CardDescription>
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
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
