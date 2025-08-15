"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function ReportsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [reportType, setReportType] = useState(searchParams.get("type") || "all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    searchParams.get("date_from") ? new Date(searchParams.get("date_from")!) : undefined,
  )
  const [dateTo, setDateTo] = useState<Date | undefined>(
    searchParams.get("date_to") ? new Date(searchParams.get("date_to")!) : undefined,
  )
  const [location, setLocation] = useState(searchParams.get("location_id") || "all")
  const [supplier, setSupplier] = useState(searchParams.get("supplier_id") || "all")

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    if (reportType !== "all") params.set("type", reportType)
    if (dateFrom) params.set("date_from", format(dateFrom, "yyyy-MM-dd"))
    if (dateTo) params.set("date_to", format(dateTo, "yyyy-MM-dd"))
    if (location !== "all") params.set("location_id", location)
    if (supplier !== "all") params.set("supplier_id", supplier)

    router.push(`/reports?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setReportType("all")
    setDateFrom(undefined)
    setDateTo(undefined)
    setLocation("all")
    setSupplier("all")
    router.push("/reports")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Report Type */}
            <div className="space-y-2">
              <Label>Loại Báo cáo</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="inventory">Tồn kho</SelectItem>
                  <SelectItem value="goods_receipt">Nhập kho</SelectItem>
                  <SelectItem value="goods_issue">Xuất kho</SelectItem>
                  <SelectItem value="transfer">Chuyển kho</SelectItem>
                  <SelectItem value="financial">Tài chính</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Địa điểm</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn địa điểm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="wh001">Kho chính</SelectItem>
                  <SelectItem value="wh002">Kho phụ</SelectItem>
                  <SelectItem value="wh003">Kho xuất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Supplier */}
            <div className="space-y-2">
              <Label>Nhà cung cấp</Label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn NCC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="sup001">Electronics Co.</SelectItem>
                  <SelectItem value="sup002">Office Supplies Ltd.</SelectItem>
                  <SelectItem value="sup003">Furniture World</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleApplyFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Áp dụng Bộ lọc
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Xóa Bộ lọc
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
