"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useLanguage } from "@/contexts/language-context"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", inbound: 186, outbound: 80 },
  { month: "Feb", inbound: 305, outbound: 200 },
  { month: "Mar", inbound: 237, outbound: 120 },
  { month: "Apr", inbound: 273, outbound: 190 },
  { month: "May", inbound: 209, outbound: 130 },
  { month: "Jun", inbound: 214, outbound: 140 },
]

const chartConfig = {
  inbound: {
    label: "Inbound",
    color: "hsl(var(--chart-1))",
  },
  outbound: {
    label: "Outbound",
    color: "hsl(var(--chart-2))",
  },
}

export function InventoryChart() {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Movement</CardTitle>
        <CardDescription>Monthly inbound and outbound inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="inbound" fill="var(--color-inbound)" />
              <Bar dataKey="outbound" fill="var(--color-outbound)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
