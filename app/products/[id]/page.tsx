import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Share2, Heart } from "lucide-react"
import Link from "next/link"

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, product_categories(name)")
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch related products from same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*, product_categories(name)")
    .eq("category_id", product.category_id)
    .eq("is_active", true)
    .neq("id", id)
    .limit(4)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/products" className="hover:text-primary flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke Katalog
          </Link>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.image_url || `/placeholder.svg?height=600&width=600&query=${product.name}`}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary">{product.product_categories?.name}</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">{product.name}</h1>
              <div className="text-3xl font-bold text-primary">Rp {product.price?.toLocaleString("id-ID")}</div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Deskripsi Produk</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "Deskripsi produk akan segera tersedia."}
              </p>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1" asChild>
                  <Link href="/contact">Hubungi Kami untuk Pemesanan</Link>
                </Button>
                <Button size="lg" variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/online-shops">Beli di Toko Online</Link>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{product.product_categories?.name}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Tersedia</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="space-y-8">
            <Separator />
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Produk Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={
                          relatedProduct.image_url ||
                          `/placeholder.svg?height=300&width=300&query=${relatedProduct.name || "/placeholder.svg"}`
                        }
                        alt={relatedProduct.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="space-y-2">
                        <Badge variant="secondary" className="w-fit">
                          {relatedProduct.product_categories?.name}
                        </Badge>
                        <CardTitle className="text-lg line-clamp-2">{relatedProduct.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          Rp {relatedProduct.price?.toLocaleString("id-ID")}
                        </span>
                        <Button size="sm" asChild>
                          <Link href={`/products/${relatedProduct.id}`}>Detail</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
