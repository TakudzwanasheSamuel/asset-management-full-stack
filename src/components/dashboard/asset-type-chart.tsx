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
  { month: "Jan", laptops: 480, monitors: 300, phones: 150 },
  { month: "Feb", laptops: 500, monitors: 310, phones: 160 },
  { month: "Mar", laptops: 510, monitors: 320, phones: 170 },
  { month: "Apr", laptops: 530, monitors: 325, phones: 180 },
  { month: "May", laptops: 540, monitors: 330, phones: 185 },
  { month: "Jun", laptops: 550, monitors: 340, phones: 190 },
]

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Growth by Type</CardTitle>
        <CardDescription>Number of assets by type over the last 6 months.</CardDescription>
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
            <Line dataKey="laptops" type="monotone" stroke="var(--color-laptops)" strokeWidth={2} dot={false} />
            <Line dataKey="monitors" type="monotone" stroke="var(--color-monitors)" strokeWidth={2} dot={false} />
            <Line dataKey="phones" type="monotone" stroke="var(--color-phones)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
