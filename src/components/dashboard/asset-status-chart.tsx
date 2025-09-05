"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { status: "Available", count: 890, fill: "var(--color-available)" },
  { status: "Checked Out", count: 312, fill: "var(--color-checkedOut)" },
  { status: "Maintenance", count: 52, fill: "var(--color-maintenance)" },
  { status: "Retired", count: 18, fill: "var(--color-retired)" },
]

const chartConfig = {
  count: {
    label: "Assets",
  },
  available: {
    label: "Available",
    color: "hsl(var(--chart-1))",
  },
  checkedOut: {
    label: "Checked Out",
    color: "hsl(var(--chart-2))",
  },
  maintenance: {
    label: "Maintenance",
    color: "hsl(var(--chart-3))",
  },
  retired: {
    label: "Retired",
    color: "hsl(var(--chart-4))",
  },
}

export function AssetStatusDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Status</CardTitle>
        <CardDescription>Distribution of assets by status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
