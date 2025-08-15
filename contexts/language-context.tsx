"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "vi" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  vi: {
    // Navigation
    "nav.dashboard": "Bảng điều khiển",
    "nav.inventory": "Quản lý kho",
    "nav.goods-receipt": "Nhập kho",
    "nav.goods-issue": "Xuất kho",
    "nav.transfer": "Chuyển kho",
    "nav.products": "Sản phẩm",
    "nav.users": "Người dùng",
    "nav.settings": "Cài đặt",

    // Dashboard
    "dashboard.title": "Bảng điều khiển",
    "dashboard.total-products": "Tổng sản phẩm",
    "dashboard.low-stock": "Sắp hết hàng",
    "dashboard.pending-orders": "Đơn chờ xử lý",
    "dashboard.recent-activities": "Hoạt động gần đây",
    "dashboard.inventory-movement": "Biến động kho",
    "dashboard.stock-levels": "Mức tồn kho",
    "dashboard.quick-actions": "Thao tác nhanh",
    "dashboard.create-receipt": "Tạo phiếu nhập",
    "dashboard.create-issue": "Tạo phiếu xuất",
    "dashboard.create-transfer": "Tạo chuyển kho",
    "dashboard.view-inventory": "Xem kho hàng",
    "dashboard.total-value": "Tổng giá trị",
    "dashboard.active-users": "Người dùng hoạt động",

    // Inventory
    "inventory.title": "Quản lý kho hàng",
    "inventory.add-product": "Thêm sản phẩm",
    "inventory.product-code": "Mã sản phẩm",
    "inventory.product-name": "Tên sản phẩm",
    "inventory.category": "Danh mục",
    "inventory.current-stock": "Tồn kho hiện tại",
    "inventory.unit": "Đơn vị",
    "inventory.unit-price": "Đơn giá",
    "inventory.location": "Vị trí",
    "inventory.last-updated": "Cập nhật cuối",
    "inventory.filter-by-category": "Lọc theo danh mục",
    "inventory.filter-by-status": "Lọc theo trạng thái",
    "inventory.all-categories": "Tất cả danh mục",
    "inventory.in-stock": "Còn hàng",
    "inventory.out-of-stock": "Hết hàng",
    "inventory.low-stock": "Sắp hết",
    "inventory.adjust-stock": "Điều chỉnh tồn kho",
    "inventory.stock-history": "Lịch sử tồn kho",
    "inventory.reorder-level": "Mức đặt hàng lại",
    "inventory.max-stock": "Tồn kho tối đa",
    "inventory.supplier": "Nhà cung cấp",
    "inventory.description": "Mô tả",

    // Goods Receipt
    "goods-receipt.title": "Quản lý nhập kho",
    "goods-receipt.create": "Tạo phiếu nhập",
    "goods-receipt.receipt-number": "Số phiếu nhập",
    "goods-receipt.supplier": "Nhà cung cấp",
    "goods-receipt.receipt-date": "Ngày nhập",
    "goods-receipt.expected-date": "Ngày dự kiến",
    "goods-receipt.received-date": "Ngày nhận",
    "goods-receipt.total-items": "Tổng số mặt hàng",
    "goods-receipt.total-quantity": "Tổng số lượng",
    "goods-receipt.total-value": "Tổng giá trị",
    "goods-receipt.status.pending": "Chờ xử lý",
    "goods-receipt.status.approved": "Đã duyệt",
    "goods-receipt.status.received": "Đã nhận",
    "goods-receipt.status.cancelled": "Đã hủy",
    "goods-receipt.add-item": "Thêm mặt hàng",
    "goods-receipt.select-product": "Chọn sản phẩm",
    "goods-receipt.expected-quantity": "Số lượng dự kiến",
    "goods-receipt.received-quantity": "Số lượng nhận",
    "goods-receipt.unit-cost": "Đơn giá",
    "goods-receipt.notes": "Ghi chú",
    "goods-receipt.approve": "Duyệt phiếu",
    "goods-receipt.receive": "Nhận hàng",

    // Goods Issue
    "goods-issue.title": "Quản lý xuất kho",
    "goods-issue.create": "Tạo phiếu xuất",
    "goods-issue.issue-number": "Số phiếu xuất",
    "goods-issue.customer": "Khách hàng",
    "goods-issue.department": "Phòng ban",
    "goods-issue.issue-date": "Ngày xuất",
    "goods-issue.requested-date": "Ngày yêu cầu",
    "goods-issue.issued-date": "Ngày xuất thực tế",
    "goods-issue.status.pending": "Chờ xử lý",
    "goods-issue.status.approved": "Đã duyệt",
    "goods-issue.status.issued": "Đã xuất",
    "goods-issue.status.cancelled": "Đã hủy",
    "goods-issue.requested-quantity": "Số lượng yêu cầu",
    "goods-issue.issued-quantity": "Số lượng xuất",
    "goods-issue.available-stock": "Tồn kho khả dụng",
    "goods-issue.issue": "Xuất hàng",

    // Transfer Orders
    "transfer.title": "Quản lý chuyển kho",
    "transfer.create": "Tạo lệnh chuyển kho",
    "transfer.transfer-number": "Số lệnh chuyển",
    "transfer.from-location": "Từ kho",
    "transfer.to-location": "Đến kho",
    "transfer.transfer-date": "Ngày chuyển",
    "transfer.requested-date": "Ngày yêu cầu",
    "transfer.completed-date": "Ngày hoàn thành",
    "transfer.status.pending": "Chờ xử lý",
    "transfer.status.approved": "Đã duyệt",
    "transfer.status.in-transit": "Đang vận chuyển",
    "transfer.status.completed": "Đã hoàn thành",
    "transfer.status.cancelled": "Đã hủy",
    "transfer.approve": "Duyệt chuyển kho",
    "transfer.start-transfer": "Bắt đầu chuyển",
    "transfer.complete-transfer": "Hoàn thành chuyển",
    "transfer.tracking": "Theo dõi vận chuyển",
    "transfer.reason": "Lý do chuyển kho",

    // Users
    "users.title": "Quản lý người dùng",
    "users.add-user": "Thêm người dùng",
    "users.full-name": "Họ và tên",
    "users.email": "Email",
    "users.phone": "Số điện thoại",
    "users.role": "Vai trò",
    "users.department": "Phòng ban",
    "users.status": "Trạng thái",
    "users.last-login": "Đăng nhập cuối",
    "users.created-date": "Ngày tạo",
    "users.role.admin": "Quản trị viên",
    "users.role.manager": "Quản lý",
    "users.role.operator": "Nhân viên kho",
    "users.role.viewer": "Người xem",
    "users.status.active": "Hoạt động",
    "users.status.inactive": "Không hoạt động",
    "users.status.suspended": "Tạm khóa",
    "users.permissions": "Quyền hạn",
    "users.activity": "Hoạt động",
    "users.profile": "Hồ sơ",
    "users.change-password": "Đổi mật khẩu",

    // Common
    "common.search": "Tìm kiếm",
    "common.add": "Thêm",
    "common.edit": "Sửa",
    "common.delete": "Xóa",
    "common.save": "Lưu",
    "common.cancel": "Hủy",
    "common.actions": "Thao tác",
    "common.status": "Trạng thái",
    "common.date": "Ngày",
    "common.quantity": "Số lượng",
    "common.loading": "Đang tải...",
    "common.view": "Xem",
    "common.details": "Chi tiết",
    "common.export": "Xuất dữ liệu",
    "common.import": "Nhập dữ liệu",
    "common.print": "In",
    "common.refresh": "Làm mới",
    "common.filter": "Lọc",
    "common.sort": "Sắp xếp",
    "common.total": "Tổng cộng",
    "common.confirm": "Xác nhận",
    "common.warning": "Cảnh báo",
    "common.error": "Lỗi",
    "common.success": "Thành công",
    "common.info": "Thông tin",

    // Messages
    "message.confirm-delete": "Bạn có chắc chắn muốn xóa?",
    "message.save-success": "Lưu thành công!",
    "message.delete-success": "Xóa thành công!",
    "message.error-occurred": "Đã xảy ra lỗi!",
    "message.no-data": "Không có dữ liệu",
    "message.invalid-input": "Dữ liệu nhập không hợp lệ",
    "message.required-field": "Trường này là bắt buộc",

    // Theme
    "theme.light": "Sáng",
    "theme.dark": "Tối",
    "theme.system": "Hệ thống",

    // Language
    "language.vietnamese": "Tiếng Việt",
    "language.english": "English",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.inventory": "Inventory",
    "nav.goods-receipt": "Goods Receipt",
    "nav.goods-issue": "Goods Issue",
    "nav.transfer": "Transfer Orders",
    "nav.products": "Products",
    "nav.users": "Users",
    "nav.settings": "Settings",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.total-products": "Total Products",
    "dashboard.low-stock": "Low Stock",
    "dashboard.pending-orders": "Pending Orders",
    "dashboard.recent-activities": "Recent Activities",
    "dashboard.inventory-movement": "Inventory Movement",
    "dashboard.stock-levels": "Stock Levels",
    "dashboard.quick-actions": "Quick Actions",
    "dashboard.create-receipt": "Create Receipt",
    "dashboard.create-issue": "Create Issue",
    "dashboard.create-transfer": "Create Transfer",
    "dashboard.view-inventory": "View Inventory",
    "dashboard.total-value": "Total Value",
    "dashboard.active-users": "Active Users",

    // Inventory
    "inventory.title": "Inventory Management",
    "inventory.add-product": "Add Product",
    "inventory.product-code": "Product Code",
    "inventory.product-name": "Product Name",
    "inventory.category": "Category",
    "inventory.current-stock": "Current Stock",
    "inventory.unit": "Unit",
    "inventory.unit-price": "Unit Price",
    "inventory.location": "Location",
    "inventory.last-updated": "Last Updated",
    "inventory.filter-by-category": "Filter by Category",
    "inventory.filter-by-status": "Filter by Status",
    "inventory.all-categories": "All Categories",
    "inventory.in-stock": "In Stock",
    "inventory.out-of-stock": "Out of Stock",
    "inventory.low-stock": "Low Stock",
    "inventory.adjust-stock": "Adjust Stock",
    "inventory.stock-history": "Stock History",
    "inventory.reorder-level": "Reorder Level",
    "inventory.max-stock": "Max Stock",
    "inventory.supplier": "Supplier",
    "inventory.description": "Description",

    // Goods Receipt
    "goods-receipt.title": "Goods Receipt Management",
    "goods-receipt.create": "Create Receipt",
    "goods-receipt.receipt-number": "Receipt Number",
    "goods-receipt.supplier": "Supplier",
    "goods-receipt.receipt-date": "Receipt Date",
    "goods-receipt.expected-date": "Expected Date",
    "goods-receipt.received-date": "Received Date",
    "goods-receipt.total-items": "Total Items",
    "goods-receipt.total-quantity": "Total Quantity",
    "goods-receipt.total-value": "Total Value",
    "goods-receipt.status.pending": "Pending",
    "goods-receipt.status.approved": "Approved",
    "goods-receipt.status.received": "Received",
    "goods-receipt.status.cancelled": "Cancelled",
    "goods-receipt.add-item": "Add Item",
    "goods-receipt.select-product": "Select Product",
    "goods-receipt.expected-quantity": "Expected Quantity",
    "goods-receipt.received-quantity": "Received Quantity",
    "goods-receipt.unit-cost": "Unit Cost",
    "goods-receipt.notes": "Notes",
    "goods-receipt.approve": "Approve",
    "goods-receipt.receive": "Receive",

    // Goods Issue
    "goods-issue.title": "Goods Issue Management",
    "goods-issue.create": "Create Issue",
    "goods-issue.issue-number": "Issue Number",
    "goods-issue.customer": "Customer",
    "goods-issue.department": "Department",
    "goods-issue.issue-date": "Issue Date",
    "goods-issue.requested-date": "Requested Date",
    "goods-issue.issued-date": "Issued Date",
    "goods-issue.status.pending": "Pending",
    "goods-issue.status.approved": "Approved",
    "goods-issue.status.issued": "Issued",
    "goods-issue.status.cancelled": "Cancelled",
    "goods-issue.requested-quantity": "Requested Quantity",
    "goods-issue.issued-quantity": "Issued Quantity",
    "goods-issue.available-stock": "Available Stock",
    "goods-issue.issue": "Issue",

    // Transfer Orders
    "transfer.title": "Transfer Orders Management",
    "transfer.create": "Create Transfer Order",
    "transfer.transfer-number": "Transfer Number",
    "transfer.from-location": "From Location",
    "transfer.to-location": "To Location",
    "transfer.transfer-date": "Transfer Date",
    "transfer.requested-date": "Requested Date",
    "transfer.completed-date": "Completed Date",
    "transfer.status.pending": "Pending",
    "transfer.status.approved": "Approved",
    "transfer.status.in-transit": "In Transit",
    "transfer.status.completed": "Completed",
    "transfer.status.cancelled": "Cancelled",
    "transfer.approve": "Approve",
    "transfer.start-transfer": "Start Transfer",
    "transfer.complete-transfer": "Complete Transfer",
    "transfer.tracking": "Tracking",
    "transfer.reason": "Transfer Reason",

    // Users
    "users.title": "User Management",
    "users.add-user": "Add User",
    "users.full-name": "Full Name",
    "users.email": "Email",
    "users.phone": "Phone",
    "users.role": "Role",
    "users.department": "Department",
    "users.status": "Status",
    "users.last-login": "Last Login",
    "users.created-date": "Created Date",
    "users.role.admin": "Administrator",
    "users.role.manager": "Manager",
    "users.role.operator": "Warehouse Operator",
    "users.role.viewer": "Viewer",
    "users.status.active": "Active",
    "users.status.inactive": "Inactive",
    "users.status.suspended": "Suspended",
    "users.permissions": "Permissions",
    "users.activity": "Activity",
    "users.profile": "Profile",
    "users.change-password": "Change Password",

    // Common
    "common.search": "Search",
    "common.add": "Add",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.actions": "Actions",
    "common.status": "Status",
    "common.date": "Date",
    "common.quantity": "Quantity",
    "common.loading": "Loading...",
    "common.view": "View",
    "common.details": "Details",
    "common.export": "Export",
    "common.import": "Import",
    "common.print": "Print",
    "common.refresh": "Refresh",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.total": "Total",
    "common.confirm": "Confirm",
    "common.warning": "Warning",
    "common.error": "Error",
    "common.success": "Success",
    "common.info": "Information",

    // Messages
    "message.confirm-delete": "Are you sure you want to delete?",
    "message.save-success": "Saved successfully!",
    "message.delete-success": "Deleted successfully!",
    "message.error-occurred": "An error occurred!",
    "message.no-data": "No data available",
    "message.invalid-input": "Invalid input data",
    "message.required-field": "This field is required",

    // Theme
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    // Language
    "language.vietnamese": "Tiếng Việt",
    "language.english": "English",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")

  useEffect(() => {
    const stored = localStorage.getItem("language") as Language
    if (stored && (stored === "vi" || stored === "en")) {
      setLanguage(stored)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
