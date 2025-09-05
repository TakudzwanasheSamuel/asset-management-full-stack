"use client"

import { Pie, PieChart } from "recharts"
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
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartData = [
  { type: "Laptops", count: 550, fill: "var(--color-laptops)" },
  { type: "Monitors", count: 340, fill: "var(--color-monitors)" },
  { type: "Phones", count: 190, fill: "var(--color-phones)" },
  { type: "Tablets", count: 80, fill: "var(--color-tablets)" },
  { type: "Other", count: 94, fill: "var(--color-other)" },
]

const chartConfig = {
  count: {
    label: "Assets",
  },
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
  tablets: {
    label: "Tablets",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

export function AssetTypeDistributionChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Asset Types</CardTitle>
        <CardDescription>Distribution by asset category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
