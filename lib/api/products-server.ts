import { createClient } from "@/lib/supabase/server"
import type { Product, CreateProductData } from "@/lib/api/products"

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
