"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  is_active: boolean
  is_featured: boolean
  created_at: string
  product_categories: { name: string } | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_categories(name)")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Gagal memuat produk",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return

    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error
      toast({ title: "Berhasil", description: "Produk berhasil dihapus" })
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus produk",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Produk</h1>
          <p className="text-muted-foreground">Tambah, edit, dan kelola produk UMKM</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="group">
            <div className="aspect-square overflow-hidden rounded-t-lg">
              <Image
                src={product.image_url || `/placeholder.svg?height=300&width=300&query=${product.name}`}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                  {product.is_featured && <Badge variant="outline">Unggulan</Badge>}
                </div>
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{product.product_categories?.name}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-xl font-bold text-primary">Rp {product.price?.toLocaleString("id-ID") || "0"}</div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Detail Produk</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="aspect-square overflow-hidden rounded-lg border">
                          <Image
                            src={product.image_url || `/placeholder.svg?height=400&width=400&query=${product.name}`}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.product_categories?.name}</p>
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            Rp {product.price?.toLocaleString("id-ID") || "0"}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={product.is_active ? "default" : "secondary"}>
                              {product.is_active ? "Aktif" : "Nonaktif"}
                            </Badge>
                            {product.is_featured && <Badge variant="outline">Unggulan</Badge>}
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Deskripsi</h4>
                            <p className="text-sm text-muted-foreground">
                              {product.description || "Tidak ada deskripsi"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Dibuat</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(product.created_at).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Belum ada produk</h3>
              <p className="text-muted-foreground">Mulai dengan menambahkan produk pertama Anda</p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Produk
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
