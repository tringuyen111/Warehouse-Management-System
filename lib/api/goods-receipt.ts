import { createClient } from "@/lib/supabase/server"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface GoodsReceipt {
  id: string
  receipt_number: string
  supplier_id?: string
  location_id?: string
  status: string
  receipt_date: string
  expected_date?: string
  reference_number?: string
  notes?: string
  total_items: number
  total_quantity: number
  total_value: number
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  approved_at?: string
  approved_by?: string
  received_at?: string
  received_by?: string
  supplier?: {
    id: string
    code: string
    name: string
  }
  location?: {
    id: string
    code: string
    name: string
  }
  created_by_user?: {
    full_name: string
  }
}

export interface GoodsReceiptItem {
  id: string
  receipt_id: string
  product_id: string
  quantity_expected: number
  quantity_received: number
  unit_price: number
  total_price: number
  batch_number?: string
  serial_numbers?: string[]
  expiry_date?: string
  notes?: string
  created_at: string
  updated_at: string
  product?: {
    id: string
    sku: string
    name: string
    unit?: {
      code: string
      name: string
    }
  }
}

export interface CreateGoodsReceiptData {
  supplier_id?: string
  location_id?: string
  expected_date?: string
  reference_number?: string
  notes?: string
  items: {
    product_id: string
    quantity_expected: number
    unit_price: number
    batch_number?: string
    expiry_date?: string
    notes?: string
  }[]
}

// Server-side functions
export async function getGoodsReceipts(filters?: {
  status?: string
  supplier_id?: string
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  let query = supabase
    .from("goods_receipts")
    .select(`
      *,
      supplier:suppliers(id, code, name),
      location:locations(id, code, name),
      created_by_user:users(full_name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.supplier_id) {
    query = query.eq("supplier_id", filters.supplier_id)
  }

  if (filters?.date_from) {
    query = query.gte("receipt_date", filters.date_from)
  }

  if (filters?.date_to) {
    query = query.lte("receipt_date", filters.date_to)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch goods receipts: ${error.message}`)
  }

  return data as GoodsReceipt[]
}

export async function getGoodsReceipt(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("goods_receipts")
    .select(`
      *,
      supplier:suppliers(id, code, name),
      location:locations(id, code, name),
      created_by_user:users(full_name),
      items:goods_receipt_items(
        *,
        product:products(id, sku, name, unit:units(code, name))
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch goods receipt: ${error.message}`)
  }

  return data as GoodsReceipt & { items: GoodsReceiptItem[] }
}

export async function createGoodsReceipt(receiptData: CreateGoodsReceiptData) {
  const supabase = createClient()

  // Generate receipt number
  const { data: receiptNumberData } = await supabase.rpc("generate_receipt_number")
  const receipt_number = receiptNumberData || `GR-${Date.now()}`

  // Create the receipt
  const { data: receipt, error: receiptError } = await supabase
    .from("goods_receipts")
    .insert([
      {
        receipt_number,
        supplier_id: receiptData.supplier_id,
        location_id: receiptData.location_id,
        expected_date: receiptData.expected_date,
        reference_number: receiptData.reference_number,
        notes: receiptData.notes,
        status: "draft",
      },
    ])
    .select()
    .single()

  if (receiptError) {
    throw new Error(`Failed to create goods receipt: ${receiptError.message}`)
  }

  // Create the items
  const items = receiptData.items.map((item) => ({
    receipt_id: receipt.id,
    product_id: item.product_id,
    quantity_expected: item.quantity_expected,
    unit_price: item.unit_price,
    batch_number: item.batch_number,
    expiry_date: item.expiry_date,
    notes: item.notes,
  }))

  const { error: itemsError } = await supabase.from("goods_receipt_items").insert(items)

  if (itemsError) {
    throw new Error(`Failed to create goods receipt items: ${itemsError.message}`)
  }

  return receipt as GoodsReceipt
}

export async function updateGoodsReceiptStatus(id: string, status: string, notes?: string) {
  const supabase = createClient()

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "approved") {
    updateData.approved_at = new Date().toISOString()
  } else if (status === "received") {
    updateData.received_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from("goods_receipts").update(updateData).eq("id", id).select().single()

  if (error) {
    throw new Error(`Failed to update goods receipt status: ${error.message}`)
  }

  return data as GoodsReceipt
}

// Client-side API class
export class GoodsReceiptAPI {
  private supabase = createClientComponentClient()

  async getGoodsReceipts(filters?: {
    status?: string
    supplier_id?: string
    date_from?: string
    date_to?: string
    limit?: number
    offset?: number
  }) {
    let query = this.supabase
      .from("goods_receipts")
      .select(`
        *,
        supplier:suppliers(id, code, name),
        location:locations(id, code, name),
        created_by_user:users(full_name)
      `)
      .order("created_at", { ascending: false })

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.supplier_id) {
      query = query.eq("supplier_id", filters.supplier_id)
    }

    if (filters?.date_from) {
      query = query.gte("receipt_date", filters.date_from)
    }

    if (filters?.date_to) {
      query = query.lte("receipt_date", filters.date_to)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch goods receipts: ${error.message}`)
    }

    return data as GoodsReceipt[]
  }

  async createGoodsReceipt(receiptData: CreateGoodsReceiptData) {
    // Generate receipt number (simplified for client-side)
    const receipt_number = `GR-${Date.now()}`

    // Create the receipt
    const { data: receipt, error: receiptError } = await this.supabase
      .from("goods_receipts")
      .insert([
        {
          receipt_number,
          supplier_id: receiptData.supplier_id,
          location_id: receiptData.location_id,
          expected_date: receiptData.expected_date,
          reference_number: receiptData.reference_number,
          notes: receiptData.notes,
          status: "draft",
        },
      ])
      .select()
      .single()

    if (receiptError) {
      throw new Error(`Failed to create goods receipt: ${receiptError.message}`)
    }

    // Create the items
    const items = receiptData.items.map((item) => ({
      receipt_id: receipt.id,
      product_id: item.product_id,
      quantity_expected: item.quantity_expected,
      unit_price: item.unit_price,
      batch_number: item.batch_number,
      expiry_date: item.expiry_date,
      notes: item.notes,
    }))

    const { error: itemsError } = await this.supabase.from("goods_receipt_items").insert(items)

    if (itemsError) {
      throw new Error(`Failed to create goods receipt items: ${itemsError.message}`)
    }

    return receipt as GoodsReceipt
  }

  async updateReceiptStatus(id: string, status: string) {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "approved") {
      updateData.approved_at = new Date().toISOString()
    } else if (status === "received") {
      updateData.received_at = new Date().toISOString()
    }

    const { data, error } = await this.supabase.from("goods_receipts").update(updateData).eq("id", id).select().single()

    if (error) {
      throw new Error(`Failed to update goods receipt status: ${error.message}`)
    }

    return data as GoodsReceipt
  }
}
