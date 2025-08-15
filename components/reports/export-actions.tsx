"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, FileText, Download, Settings, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ExportActions() {
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState("excel")
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeSummary: true,
    includeDetails: true,
    includeFilters: true,
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Xuất báo cáo thành công",
        description: `Báo cáo đã được xuất dưới định dạng ${exportFormat.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Lỗi xuất báo cáo",
        description: "Không thể xuất báo cáo. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleOptionChange = (option: keyof typeof exportOptions, checked: boolean) => {
    setExportOptions((prev) => ({ ...prev, [option]: checked }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Xuất Báo cáo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Export Format */}
          <div className="space-y-2">
            <Label>Định dạng</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel (.xlsx)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF (.pdf)
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (.csv)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label>Tùy chọn</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  checked={exportOptions.includeCharts}
                  onCheckedChange={(checked) => handleOptionChange("includeCharts", checked as boolean)}
                />
                <Label htmlFor="includeCharts" className="text-sm">
                  Bao gồm biểu đồ
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSummary"
                  checked={exportOptions.includeSummary}
                  onCheckedChange={(checked) => handleOptionChange("includeSummary", checked as boolean)}
                />
                <Label htmlFor="includeSummary" className="text-sm">
                  Bao gồm tóm tắt
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="invisible">More Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDetails"
                  checked={exportOptions.includeDetails}
                  onCheckedChange={(checked) => handleOptionChange("includeDetails", checked as boolean)}
                />
                <Label htmlFor="includeDetails" className="text-sm">
                  Bao gồm chi tiết
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeFilters"
                  checked={exportOptions.includeFilters}
                  onCheckedChange={(checked) => handleOptionChange("includeFilters", checked as boolean)}
                />
                <Label htmlFor="includeFilters" className="text-sm">
                  Bao gồm bộ lọc
                </Label>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="space-y-2">
            <Label className="invisible">Action</Label>
            <div className="space-y-2">
              <Button onClick={handleExport} disabled={isExporting} className="w-full">
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Xuất Báo cáo
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt nâng cao
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
