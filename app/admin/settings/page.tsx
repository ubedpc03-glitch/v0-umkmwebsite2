"use client"

import { useState, useEffect } from "react"
import { createAdminClient } from "@/lib/supabase/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Save, Building, Globe, Users, Shield } from "lucide-react"

interface CompanyInfo {
  id?: string
  name: string
  description: string
  vision: string
  mission: string
  address: string
  phone: string
  email: string
  whatsapp: string
  operating_hours: any
  logo_url: string
}

interface MenuSettings {
  id: string
  name: string
  url: string
  is_active: boolean
}

export default function SettingsPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    description: "",
    vision: "",
    mission: "",
    address: "",
    phone: "",
    email: "",
    whatsapp: "",
    operating_hours: {},
    logo_url: "",
  })
  const [menuItems, setMenuItems] = useState<MenuSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const supabase = createAdminClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const [companyResult, menuResult] = await Promise.all([
        supabase.from("company_info").select("*").single(),
        supabase.from("menu_items").select("*").order("sort_order"),
      ])

      if (companyResult.data) {
        setCompanyInfo({
          ...companyResult.data,
          name: companyResult.data.name || "",
          description: companyResult.data.description || "",
          vision: companyResult.data.vision || "",
          mission: companyResult.data.mission || "",
          address: companyResult.data.address || "",
          phone: companyResult.data.phone || "",
          email: companyResult.data.email || "",
          whatsapp: companyResult.data.whatsapp || "",
          logo_url: companyResult.data.logo_url || "",
        })
      }

      if (menuResult.data) {
        setMenuItems(menuResult.data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Gagal memuat pengaturan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCompanyInfo = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from("company_info").upsert(companyInfo)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Informasi perusahaan berhasil disimpan",
      })
    } catch (error) {
      console.error("Error saving company info:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan informasi perusahaan",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleMenuToggle = async (menuId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("menu_items").update({ is_active: isActive }).eq("id", menuId)

      if (error) throw error

      setMenuItems(menuItems.map((item) => (item.id === menuId ? { ...item, is_active: isActive } : item)))

      toast({
        title: "Berhasil",
        description: `Menu ${isActive ? "diaktifkan" : "dinonaktifkan"}`,
      })
    } catch (error) {
      console.error("Error updating menu:", error)
      toast({
        title: "Error",
        description: "Gagal mengubah status menu",
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
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Pengaturan Sistem</h1>
      </div>

      <div className="grid gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle>Informasi Perusahaan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nama Perusahaan</Label>
                <Input
                  id="name"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  placeholder="Nama UMKM"
                />
              </div>
              <div>
                <Label htmlFor="logo_url">URL Logo</Label>
                <Input
                  id="logo_url"
                  value={companyInfo.logo_url}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={companyInfo.description}
                onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                placeholder="Deskripsi perusahaan"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vision">Visi</Label>
                <Textarea
                  id="vision"
                  value={companyInfo.vision}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, vision: e.target.value })}
                  placeholder="Visi perusahaan"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="mission">Misi</Label>
                <Textarea
                  id="mission"
                  value={companyInfo.mission}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, mission: e.target.value })}
                  placeholder="Misi perusahaan"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                placeholder="Alamat lengkap"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                  placeholder="+62 21 1234 5678"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                  placeholder="info@perusahaan.com"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={companyInfo.whatsapp}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, whatsapp: e.target.value })}
                  placeholder="+62 812 3456 7890"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveCompanyInfo} disabled={saving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan Informasi"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Pengaturan Menu Website</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Aktifkan atau nonaktifkan menu yang akan ditampilkan di website
              </p>
              <div className="grid gap-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.url}</p>
                    </div>
                    <Switch
                      checked={item.is_active}
                      onCheckedChange={(checked) => handleMenuToggle(item.id, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Manajemen User</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fitur manajemen user dengan multi-role akan segera tersedia
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <h4 className="font-semibold">Admin</h4>
                    <p className="text-2xl font-bold text-primary">1</p>
                    <p className="text-sm text-muted-foreground">Akses penuh</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <h4 className="font-semibold">Editor</h4>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-muted-foreground">Edit konten</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <h4 className="font-semibold">Viewer</h4>
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-muted-foreground">Lihat saja</p>
                  </div>
                </Card>
              </div>
              <Button variant="outline" disabled>
                Tambah User (Segera Hadir)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
