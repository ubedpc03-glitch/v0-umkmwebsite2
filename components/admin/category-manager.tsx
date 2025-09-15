"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string | null
}

interface CategoryManagerProps {
  categories: Category[]
}

export function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    try {
      if (editingId) {
        // Update existing category
        const { data, error } = await supabase
          .from("product_categories")
          .update({
            name: formData.name,
            description: formData.description || null,
          })
          .eq("id", editingId)
          .select()
          .single()

        if (error) throw error

        setCategories(categories.map((cat) => (cat.id === editingId ? data : cat)))
        setEditingId(null)
      } else {
        // Create new category
        const { data, error } = await supabase
          .from("product_categories")
          .insert({
            name: formData.name,
            description: formData.description || null,
          })
          .select()
          .single()

        if (error) throw error

        setCategories([...categories, data])
        setIsAdding(false)
      }

      setFormData({ name: "", description: "" })
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return

    const supabase = createClient()
    try {
      const { error } = await supabase.from("product_categories").delete().eq("id", id)
      if (error) throw error

      setCategories(categories.filter((cat) => cat.id !== id))
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: "", description: "" })
  }

  return (
    <div className="space-y-6">
      {/* Add New Category Button */}
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kategori
        </Button>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Kategori" : "Tambah Kategori Baru"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama kategori"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Masukkan deskripsi kategori"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update" : "Simpan"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  {category.description && <p className="text-sm text-muted-foreground mt-1">{category.description}</p>}
                </div>
                <Badge variant="secondary">Kategori</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(category)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && !isAdding && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Belum ada kategori</h3>
              <p className="text-muted-foreground">Mulai dengan menambahkan kategori pertama</p>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
