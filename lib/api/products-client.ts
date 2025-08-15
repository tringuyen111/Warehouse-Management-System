import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { CreateProductData, Product } from "@/lib/api/products"

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
