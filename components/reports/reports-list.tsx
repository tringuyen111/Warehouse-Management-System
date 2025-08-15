"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Download, MoreHorizontal, FileText, Calendar, User } from "lucide-react"

interface ReportsListProps {
  filters: {
    type?: string
    date_from?: string
    date_to?: string
    location_id?: string
    supplier_id?: string
  }
}

// Mock data - in real app this would come from API based on filters
const reportsData = [
  {
    id: "1",
    name: "Báo cáo Tồn kho Tháng 12",
    type: "inventory",
    status: "completed",
    created_at: "2024-01-15T10:30:00Z",
    created_by: "Nguyễn Văn A",
    file_size: "2.5 MB",
    format: "Excel",
  },
  {
    id: "2",
    name: "Báo cáo Nhập kho Tuần 3",
    type: "goods_receipt",
    status: "processing",
    created_at: "2024-01-14T14:20:00Z",
    created_by: "Trần Thị B",
    file_size: "1.8 MB",
    format: "PDF",
  },
  {
    id: "3",
    name: "Báo cáo Xuất kho Q4",
    type: "goods_issue",
    status: "completed",
    created_at: "2024-01-13T09:15:00Z",
    created_by: "Lê Văn C",
    file_size: "3.2 MB",
    format: "Excel",
  },
  {
    id: "4",
    name: "Báo cáo Chuyển kho Tháng 12",
    type: "transfer",
    status: "failed",
    created_at: "2024-01-12T16:45:00Z",
    created_by: "Phạm Thị D",
    file_size: "0 MB",
    format: "PDF",
  },
  {
    id: "5",
    name: "Báo cáo Tài chính Q4",
    type: "financial",
    status: "completed",
    created_at: "2024-01-11T11:30:00Z",
    created_by: "Hoàng Văn E",
    file_size: "4.1 MB",
    format: "Excel",
  },
]

const getTypeLabel = (type: string) => {
  const types = {
    inventory: "Tồn kho",
    goods_receipt: "Nhập kho",
    goods_issue: "Xuất kho",
    transfer: "Chuyển kho",
    financial: "Tài chính",
  }
  return types[type as keyof typeof types] || type
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    completed: { label: "Hoàn thành", variant: "default" as const },
    processing: { label: "Đang xử lý", variant: "secondary" as const },
    failed: { label: "Thất bại", variant: "destructive" as const },
  }
  const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "secondary" as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function ReportsList({ filters }: ReportsListProps) {
  // Filter reports based on filters prop
  const filteredReports = reportsData.filter((report) => {
    if (filters.type && filters.type !== "all" && report.type !== filters.type) {
      return false
    }
    // Add more filter logic here based on date, location, etc.
    return true
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Danh sách Báo cáo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Báo cáo</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead>Kích thước</TableHead>
              <TableHead>Định dạng</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getTypeLabel(report.type)}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(report.created_at).toLocaleDateString("vi-VN")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {report.created_by}
                  </div>
                </TableCell>
                <TableCell>{report.file_size}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{report.format}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      {report.status === "completed" && (
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Tải xuống
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
