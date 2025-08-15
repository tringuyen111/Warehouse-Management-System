export interface Product {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  minStock: number
  price: number
  location: string
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface GoodsReceipt {
  id: string
  receiptNumber: string
  supplier: string
  items: GoodsReceiptItem[]
  status: "pending" | "approved" | "completed"
  createdAt: Date
  createdBy: string
}

export interface GoodsReceiptItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface GoodsIssue {
  id: string
  issueNumber: string
  department: string
  items: GoodsIssueItem[]
  status: "pending" | "approved" | "completed"
  createdAt: Date
  createdBy: string
}

export interface GoodsIssueItem {
  productId: string
  productName: string
  requestedQuantity: number
  approvedQuantity: number
}

export interface TransferOrder {
  id: string
  transferNumber: string
  fromLocation: string
  toLocation: string
  items: TransferOrderItem[]
  status: "pending" | "in-transit" | "completed"
  createdAt: Date
  createdBy: string
}

export interface TransferOrderItem {
  productId: string
  productName: string
  quantity: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "operator"
  department: string
  status: "active" | "inactive"
  createdAt: Date
}

export interface DashboardStats {
  totalProducts: number
  lowStockItems: number
  pendingOrders: number
  totalValue: number
}
