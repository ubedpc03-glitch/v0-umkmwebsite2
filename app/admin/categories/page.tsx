import { createClient } from "@/lib/supabase/server"
import { CategoryManager } from "@/components/admin/category-manager"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from("product_categories").select("*").order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Kategori</h1>
        <p className="text-muted-foreground">Tambah, edit, dan kelola kategori produk</p>
      </div>

      <CategoryManager categories={categories || []} />
    </div>
  )
}
