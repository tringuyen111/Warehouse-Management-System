"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Check, X, Plus } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface GoodsReceipt {
  id: string
  receiptNumber: string
  supplier: string
  totalItems: number
  totalValue: number
  status: "pending" | "approved" | "completed" | "rejected"
  createdAt: string
  createdBy: string
}

const mockReceipts: GoodsReceipt[] = [
  {
    id: "1",
    receiptNumber: "GR-001",
    supplier: "Electronics Supplier Co.",
    totalItems: 3,
    totalValue: 15000,
    status: "pending",
    createdAt: "2024-01-15",
    createdBy: "John Doe",
  },
  {
    id: "2",
    receiptNumber: "GR-002",
    supplier: "Office Supplies Ltd.",
    totalItems: 5,
    totalValue: 2500,
    status: "completed",
    createdAt: "2024-01-14",
    createdBy: "Jane Smith",
  },
  {
    id: "3",
    receiptNumber: "GR-003",
    supplier: "Furniture World",
    totalItems: 2,
    totalValue: 8000,
    status: "approved",
    createdAt: "2024-01-13",
    createdBy: "Mike Johnson",
  },
  {
    id: "4",
    receiptNumber: "GR-004",
    supplier: "Tech Components Inc.",
    totalItems: 4,
    totalValue: 12000,
    status: "rejected",
    createdAt: "2024-01-12",
    createdBy: "Sarah Wilson",
  },
]

export function GoodsReceiptList() {
  const { t } = useLanguage()

  function getStatusBadge(status: GoodsReceipt["status"]) {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            {t("status.pending")}
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {t("status.approved")}
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            {t("status.completed")}
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">{t("status.rejected")}</Badge>
        )
      default:
        return <Badge>{t("status.unknown")}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("goodsReceipt.goodsReceipts")}</CardTitle>
          <Button asChild>
            <Link href="/goods-receipt/new">
              <Plus className="h-4 w-4 mr-2" />
              {t("goodsReceipt.newReceipt")}
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("goodsReceipt.receiptNumber")}</TableHead>
                <TableHead>{t("goodsReceipt.supplier")}</TableHead>
                <TableHead className="text-right">{t("goodsReceipt.items")}</TableHead>
                <TableHead className="text-right">{t("goodsReceipt.totalValue")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead>{t("common.createdBy")}</TableHead>
                <TableHead>{t("common.date")}</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReceipts.map((receipt) => (
                <TableRow key={receipt.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">{receipt.receiptNumber}</TableCell>
                  <TableCell>{receipt.supplier}</TableCell>
                  <TableCell className="text-right">{receipt.totalItems}</TableCell>
                  <TableCell className="text-right font-medium">${receipt.totalValue.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                  <TableCell>{receipt.createdBy}</TableCell>
                  <TableCell>{receipt.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/goods-receipt/${receipt.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            {t("common.viewDetails")}
                          </Link>
                        </DropdownMenuItem>
                        {receipt.status === "pending" && (
                          <>
                            <DropdownMenuItem>
                              <Check className="h-4 w-4 mr-2" />
                              {t("common.approve")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <X className="h-4 w-4 mr-2" />
                              {t("common.reject")}
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href={`/goods-receipt/${receipt.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            {t("common.edit")}
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
