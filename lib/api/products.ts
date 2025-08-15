import { createClient } from "@/lib/supabase/server"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface Product {
  id: string
  sku: string
  name: string
  description?: string
  category_id?: string
  unit_id?: string
  barcode?: string
  unit_price: number
  cost_price: number
  min_stock_level: number
  max_stock_level: number
  reorder_point: number
  weight?: number
  dimensions?: any
  image_url?: string
  is_active: boolean
  is_serialized: boolean
  is_batch_tracked: boolean
  shelf_life_days?: number
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  category?: {
    id: string
    name: string
  }
  unit?: {
    id: string
    code: string
    name: string
  }
}

export interface CreateProductData {
  sku: string
  name: string
  description?: string
  category_id?: string
  unit_id?: string
  barcode?: string
  unit_price: number
  cost_price: number
  min_stock_level: number
  max_stock_level: number
  reorder_point: number
  weight?: number
  dimensions?: any
  image_url?: string
  is_serialized?: boolean
  is_batch_tracked?: boolean
  shelf_life_days?: number
}

// Server-side functions
export async function getProducts(filters?: {
  search?: string
  category_id?: string
  is_active?: boolean
  limit?: number
  offset?: number
}) {
  const supabase = createClient()

  let query = supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name),
      unit:units(id, code, name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,barcode.ilike.%${filters.search}%`)
  }

  if (filters?.category_id) {
    query = query.eq("category_id", filters.category_id)
  }

  if (filters?.is_active !== undefined) {
    query = query.eq("is_active", filters.is_active)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  return data as Product[]
}

export async function getProduct(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name),
      unit:units(id, code, name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch product: ${error.message}`)
  }

  return data as Product
}

export async function createProduct(productData: CreateProductData) {
  const supabase = createClient()

  const { data, error } = await supabase.from("products").insert([productData]).select().single()

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`)
  }

  return data as Product
}

export async function updateProduct(id: string, productData: Partial<CreateProductData>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .update({ ...productData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`)
  }

  return data as Product
}

export async function deleteProduct(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`)
  }
}

// Client-side functions
export class ProductsAPI {
  private supabase = createClientComponentClient()

  async getProducts(filters?: {
    search?: string
    category_id?: string
    is_active?: boolean
    limit?: number
    offset?: number
  }) {
    let query = this.supabase
      .from("products")
      .select(`
        *,
        category:categories(id, name),
        unit:units(id, code, name)
      `)
      .order("created_at", { ascending: false })

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,barcode.ilike.%${filters.search}%`)
    }

    if (filters?.category_id) {
      query = query.eq("category_id", filters.category_id)
    }

    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    return data as Product[]
  }

  async createProduct(productData: CreateProductData) {
    const { data, error } = await this.supabase.from("products").insert([productData]).select().single()

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`)
    }

    return data as Product
  }

  async updateProduct(id: string, productData: Partial<CreateProductData>) {
    const { data, error } = await this.supabase
      .from("products")
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`)
    }

    return data as Product
  }

  async deleteProduct(id: string) {
    const { error } = await this.supabase.from("products").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`)
    }
  }
}
