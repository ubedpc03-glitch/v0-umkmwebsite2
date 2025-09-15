import { ProductForm } from "@/components/admin/product-form"
import { createClient } from "@/lib/supabase/server"

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from("product_categories").select("*").order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
        <p className="text-muted-foreground">Tambahkan produk baru ke katalog UMKM</p>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  )
}
