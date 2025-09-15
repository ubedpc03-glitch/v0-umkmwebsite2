"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, Building } from "lucide-react"

interface CompanyInfo {
  id?: string
  name: string
  description: string
  profile: string
  vision: string
  mission: string
  address: string
  operating_hours: string
  phone: string
  email: string
  website: string
}

export default function CompanyInfoPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    description: "",
    profile: "",
    vision: "",
    mission: "",
    address: "",
    operating_hours: "",
    phone: "",
    email: "",
    website: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchCompanyInfo()
  }, [])

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase.from("company_info").select("*").single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setCompanyInfo(data)
      }
    } catch (error) {
      console.error("Error fetching company info:", error)
      toast({
        title: "Error",
        description: "Gagal memuat informasi perusahaan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
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
        <Building className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Informasi Perusahaan</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
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
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={companyInfo.website}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                  placeholder="https://www.example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi Singkat</Label>
              <Textarea
                id="description"
                value={companyInfo.description}
                onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                placeholder="Deskripsi singkat perusahaan"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="profile">Profil Perusahaan</Label>
              <Textarea
                id="profile"
                value={companyInfo.profile}
                onChange={(e) => setCompanyInfo({ ...companyInfo, profile: e.target.value })}
                placeholder="Profil lengkap perusahaan"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visi & Misi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontak & Lokasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                placeholder="Alamat lengkap perusahaan"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
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
            </div>

            <div>
              <Label htmlFor="operating_hours">Jam Operasional</Label>
              <Input
                id="operating_hours"
                value={companyInfo.operating_hours}
                onChange={(e) => setCompanyInfo({ ...companyInfo, operating_hours: e.target.value })}
                placeholder="Senin - Jumat: 08:00 - 17:00"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  )
}
