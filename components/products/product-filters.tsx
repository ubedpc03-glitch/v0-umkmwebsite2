"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface ProductFiltersProps {
  categories: Category[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  const currentCategory = searchParams.get("category")
  const currentSort = searchParams.get("sort") || "newest"

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters("search", searchTerm || null)
  }

  const clearFilters = () => {
    setSearchTerm("")
    router.push("/products")
  }

  const hasActiveFilters = currentCategory || searchParams.get("search")

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cari Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="w-full">
              Cari
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Urutkan</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentSort} onValueChange={(value) => updateFilters("sort", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="name">Nama A-Z</SelectItem>
              <SelectItem value="price_asc">Harga Terendah</SelectItem>
              <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant={!currentCategory ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => updateFilters("category", null)}
            >
              Semua Kategori
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={currentCategory === category.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => updateFilters("category", category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searchParams.get("search") && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  Pencarian: {searchParams.get("search")}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => {
                      setSearchTerm("")
                      updateFilters("search", null)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {currentCategory && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  Kategori: {categories.find((c) => c.id === currentCategory)?.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => updateFilters("category", null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={clearFilters} className="w-full bg-transparent">
                Hapus Semua Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
