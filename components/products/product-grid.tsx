"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  product_categories: { name: string } | null
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Tidak ada produk ditemukan</h3>
        <p className="text-muted-foreground">Coba ubah filter atau kata kunci pencarian Anda</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} produk ditemukan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <div className="aspect-square overflow-hidden rounded-t-lg">
              <img
                src={product.image_url || `/placeholder.svg?height=300&width=300&query=${product.name}`}
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <div className="space-y-2">
                {product.product_categories && (
                  <Badge variant="secondary" className="w-fit">
                    {product.product_categories.name}
                  </Badge>
                )}
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                {product.description && (
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  {product.price ? `Rp ${product.price.toLocaleString("id-ID")}` : "Hubungi Kami"}
                </span>
                <Button size="sm" asChild>
                  <Link href={`/products/${product.id}`}>Detail</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
