import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  const { data: product } = await supabase.from("products").select("*").eq("id", id).single()

  if (!product) {
    notFound()
  }

  const { data: categories } = await supabase.from("product_categories").select("*").order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Produk</h1>
        <p className="text-muted-foreground">Edit informasi produk {product.name}</p>
      </div>

      <ProductForm categories={categories || []} product={product} />
    </div>
  )
}
