"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"

interface GalleryItem {
  id?: string
  title: string
  description: string
  image_url: string
  is_active: boolean
  created_at?: string
}

export default function GalleryManagementPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [formData, setFormData] = useState<GalleryItem>({
    title: "",
    description: "",
    image_url: "",
    is_active: true,
  })
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setGalleryItems(data || [])
    } catch (error) {
      console.error("Error fetching gallery items:", error)
      toast({
        title: "Error",
        description: "Gagal memuat galeri",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingItem) {
        const { error } = await supabase.from("gallery").update(formData).eq("id", editingItem.id)

        if (error) throw error
        toast({ title: "Berhasil", description: "Item galeri berhasil diperbarui" })
      } else {
        const { error } = await supabase.from("gallery").insert([formData])

        if (error) throw error
        toast({ title: "Berhasil", description: "Item galeri berhasil ditambahkan" })
      }

      setShowForm(false)
      setEditingItem(null)
      setFormData({ title: "", description: "", image_url: "", is_active: true })
      fetchGalleryItems()
    } catch (error) {
      console.error("Error saving gallery item:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan item galeri",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData(item)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return

    try {
      const { error } = await supabase.from("gallery").delete().eq("id", id)

      if (error) throw error
      toast({ title: "Berhasil", description: "Item galeri berhasil dihapus" })
      fetchGalleryItems()
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus item galeri",
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Manajemen Galeri</h1>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Item
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? "Edit Item Galeri" : "Tambah Item Galeri"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul foto"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi foto"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image_url">URL Gambar</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingItem ? "Perbarui" : "Tambah"}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingItem(null)
                    setFormData({ title: "", description: "", image_url: "", is_active: true })
                  }}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <Card key={item.id}>
            <div className="aspect-square relative">
              <Image
                src={item.image_url || "/placeholder.svg?height=300&width=300&query=gallery"}
                alt={item.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-1 rounded ${item.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {item.is_active ? "Aktif" : "Tidak Aktif"}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(item.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {galleryItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum ada item galeri</h3>
          <p className="text-muted-foreground">Tambahkan item pertama untuk memulai galeri</p>
        </div>
      )}
    </div>
  )
}
