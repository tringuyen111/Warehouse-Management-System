"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Check, X, Plus } from "lucide-react"
import Link from "next/link"

interface GoodsIssue {
  id: string
  issueNumber: string
  department: string
  totalItems: number
  totalValue: number
  status: "pending" | "approved" | "completed" | "rejected"
  createdAt: string
  createdBy: string
}

const mockIssues: GoodsIssue[] = [
  {
    id: "1",
    issueNumber: "GI-001",
    department: "Production",
    totalItems: 2,
    totalValue: 5000,
    status: "pending",
    createdAt: "2024-01-15",
    createdBy: "John Doe",
  },
  {
    id: "2",
    issueNumber: "GI-002",
    department: "Marketing",
    totalItems: 3,
    totalValue: 1200,
    status: "completed",
    createdAt: "2024-01-14",
    createdBy: "Jane Smith",
  },
  {
    id: "3",
    issueNumber: "GI-003",
    department: "IT",
    totalItems: 1,
    totalValue: 800,
    status: "approved",
    createdAt: "2024-01-13",
    createdBy: "Mike Johnson",
  },
  {
    id: "4",
    issueNumber: "GI-004",
    department: "HR",
    totalItems: 4,
    totalValue: 600,
    status: "rejected",
    createdAt: "2024-01-12",
    createdBy: "Sarah Wilson",
  },
]

function getStatusBadge(status: GoodsIssue["status"]) {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
    case "approved":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Approved</Badge>
    case "completed":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
    case "rejected":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Rejected</Badge>
    default:
      return <Badge>Unknown</Badge>
  }
}

export function GoodsIssueList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Goods Issues</CardTitle>
          <Button asChild>
            <Link href="/goods-issue/new">
              <Plus className="h-4 w-4 mr-2" />
              New Issue
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue #</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIssues.map((issue) => (
                <TableRow key={issue.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">{issue.issueNumber}</TableCell>
                  <TableCell>{issue.department}</TableCell>
                  <TableCell className="text-right">{issue.totalItems}</TableCell>
                  <TableCell className="text-right font-medium">${issue.totalValue.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(issue.status)}</TableCell>
                  <TableCell>{issue.createdBy}</TableCell>
                  <TableCell>{issue.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/goods-issue/${issue.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {issue.status === "pending" && (
                          <>
                            <DropdownMenuItem>
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href={`/goods-issue/${issue.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
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
