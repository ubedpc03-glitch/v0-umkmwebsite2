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
import { Plus, Edit, Trash2, Store, ExternalLink } from "lucide-react"
import Image from "next/image"

interface OnlineShop {
  id?: string
  name: string
  description: string
  url: string
  logo_url: string
  is_active: boolean
  created_at?: string
}

export default function OnlineShopsManagementPage() {
  const [onlineShops, setOnlineShops] = useState<OnlineShop[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingShop, setEditingShop] = useState<OnlineShop | null>(null)
  const [formData, setFormData] = useState<OnlineShop>({
    name: "",
    description: "",
    url: "",
    logo_url: "",
    is_active: true,
  })
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchOnlineShops()
  }, [])

  const fetchOnlineShops = async () => {
    try {
      const { data, error } = await supabase.from("online_shops").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setOnlineShops(data || [])
    } catch (error) {
      console.error("Error fetching online shops:", error)
      toast({
        title: "Error",
        description: "Gagal memuat toko online",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingShop) {
        const { error } = await supabase.from("online_shops").update(formData).eq("id", editingShop.id)

        if (error) throw error
        toast({ title: "Berhasil", description: "Toko online berhasil diperbarui" })
      } else {
        const { error } = await supabase.from("online_shops").insert([formData])

        if (error) throw error
        toast({ title: "Berhasil", description: "Toko online berhasil ditambahkan" })
      }

      setShowForm(false)
      setEditingShop(null)
      setFormData({ name: "", description: "", url: "", logo_url: "", is_active: true })
      fetchOnlineShops()
    } catch (error) {
      console.error("Error saving online shop:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan toko online",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (shop: OnlineShop) => {
    setEditingShop(shop)
    setFormData(shop)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus toko online ini?")) return

    try {
      const { error } = await supabase.from("online_shops").delete().eq("id", id)

      if (error) throw error
      toast({ title: "Berhasil", description: "Toko online berhasil dihapus" })
      fetchOnlineShops()
    } catch (error) {
      console.error("Error deleting online shop:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus toko online",
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
          <Store className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Manajemen Toko Online</h1>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Toko
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingShop ? "Edit Toko Online" : "Tambah Toko Online"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Toko</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Shopee, Tokopedia, dll"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi toko online"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="url">URL Toko</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://shopee.co.id/namatoko"
                  required
                />
              </div>

              <div>
                <Label htmlFor="logo_url">URL Logo</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
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
                <Button type="submit">{editingShop ? "Perbarui" : "Tambah"}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingShop(null)
                    setFormData({ name: "", description: "", url: "", logo_url: "", is_active: true })
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
        {onlineShops.map((shop) => (
          <Card key={shop.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 relative">
                  {shop.logo_url ? (
                    <Image
                      src={shop.logo_url || "/placeholder.svg"}
                      alt={`${shop.name} logo`}
                      fill
                      className="object-contain rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold">{shop.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{shop.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{shop.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <a
                  href={shop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  Kunjungi Toko <ExternalLink className="h-3 w-3" />
                </a>
                <span
                  className={`text-xs px-2 py-1 rounded ${shop.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {shop.is_active ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(shop)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(shop.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {onlineShops.length === 0 && (
        <div className="text-center py-12">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum ada toko online</h3>
          <p className="text-muted-foreground">Tambahkan toko online pertama untuk memulai</p>
        </div>
      )}
    </div>
  )
}
