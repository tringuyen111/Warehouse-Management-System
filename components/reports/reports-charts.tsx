"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

interface ReportsChartsProps {
  filters: {
    type?: string
    date_from?: string
    date_to?: string
    location_id?: string
    supplier_id?: string
  }
}

// Mock data - in real app this would come from API based on filters
const inventoryMovementData = [
  { month: "T1", inbound: 186, outbound: 80, net: 106 },
  { month: "T2", inbound: 305, outbound: 200, net: 105 },
  { month: "T3", inbound: 237, outbound: 120, net: 117 },
  { month: "T4", inbound: 273, outbound: 190, net: 83 },
  { month: "T5", inbound: 209, outbound: 130, net: 79 },
  { month: "T6", inbound: 214, outbound: 140, net: 74 },
]

const valueData = [
  { month: "T1", value: 12500000 },
  { month: "T2", value: 15200000 },
  { month: "T3", value: 11800000 },
  { month: "T4", value: 14600000 },
  { month: "T5", value: 13200000 },
  { month: "T6", value: 16800000 },
]

const categoryData = [
  { name: "Điện tử", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Văn phòng phẩm", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Nội thất", value: 20, color: "hsl(var(--chart-3))" },
  { name: "An toàn", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Khác", value: 5, color: "hsl(var(--chart-5))" },
]

const chartConfig = {
  inbound: { label: "Nhập kho", color: "hsl(var(--chart-1))" },
  outbound: { label: "Xuất kho", color: "hsl(var(--chart-2))" },
  net: { label: "Ròng", color: "hsl(var(--chart-3))" },
  value: { label: "Giá trị", color: "hsl(var(--chart-1))" },
}

export function ReportsCharts({ filters }: ReportsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inventory Movement Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Biến động Tồn kho</CardTitle>
          <CardDescription>Nhập, xuất và biến động ròng theo tháng</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryMovementData}>
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

      {/* Value Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng Giá trị</CardTitle>
          <CardDescription>Giá trị tồn kho theo thời gian</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={valueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-value)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố theo Danh mục</CardTitle>
          <CardDescription>Tỷ lệ sản phẩm theo danh mục</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Chỉ số Hiệu suất</CardTitle>
          <CardDescription>Các chỉ số quan trọng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Tỷ lệ Đáp ứng Đơn hàng</span>
              <span className="text-2xl font-bold text-blue-600">98.5%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Độ Chính xác Tồn kho</span>
              <span className="text-2xl font-bold text-green-600">99.2%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">Thời gian Xử lý TB</span>
              <span className="text-2xl font-bold text-orange-600">2.3h</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">Tỷ lệ Hàng Lỗi</span>
              <span className="text-2xl font-bold text-purple-600">0.8%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
