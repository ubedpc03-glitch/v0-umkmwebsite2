import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { Badge } from "@/components/ui/badge"

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Fetch categories for filters
  const { data: categories } = await supabase.from("product_categories").select("*").order("name")

  // Build query based on search params
  let query = supabase.from("products").select("*, product_categories(name)").eq("is_active", true)

  if (params.category) {
    query = query.eq("category_id", params.category)
  }

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`)
  }

  // Apply sorting
  switch (params.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    case "name":
      query = query.order("name", { ascending: true })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data: products } = await query

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Katalog Produk</Badge>
          </div>
          <h1 className="text-4xl font-bold text-balance">Katalog Produk Kami</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
            Temukan berbagai produk berkualitas tinggi dengan harga terjangkau dari UMKM Berkah Jaya
          </p>
        </div>

        {/* Filters and Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <ProductFilters categories={categories || []} />
            </Suspense>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductGrid products={products || []} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
