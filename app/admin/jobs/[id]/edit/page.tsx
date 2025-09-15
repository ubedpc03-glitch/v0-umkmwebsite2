"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface Job {
  id: string
  title: string
  location: string
  employment_type: string
  description: string
  requirements: string
  salary_range: string
  is_active: boolean
}

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState<Job>({
    id: "",
    title: "",
    location: "",
    employment_type: "full-time",
    description: "",
    requirements: "",
    salary_range: "",
    is_active: true,
  })

  useEffect(() => {
    fetchJob()
  }, [params.id])

  const fetchJob = async () => {
    try {
      const supabase = createAdminClient()
      const { data, error } = await supabase.from("job_postings").select("*").eq("id", params.id).single()

      if (error) throw error

      setFormData({
        ...data,
        title: data.title || "",
        location: data.location || "",
        employment_type: data.employment_type || "full-time",
        description: data.description || "",
        requirements: data.requirements || "",
        salary_range: data.salary_range || "",
      })
    } catch (error) {
      console.error("Error fetching job:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data lowongan",
        variant: "destructive",
      })
      router.push("/admin/jobs")
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createAdminClient()
      const { error } = await supabase.from("job_postings").update(formData).eq("id", params.id)

      if (error) throw error

      toast({
        title: "Berhasil",
        description: "Lowongan kerja berhasil diperbarui",
      })

      router.push("/admin/jobs")
    } catch (error) {
      console.error("Error updating job:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui lowongan kerja",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/jobs">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Lowongan Kerja</h1>
          <p className="text-muted-foreground">Perbarui informasi lowongan</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Lowongan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Judul Posisi *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Software Developer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Lokasi *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Contoh: Jakarta"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employment_type">Tipe Pekerjaan *</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) => setFormData({ ...formData, employment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Kontrak</SelectItem>
                    <SelectItem value="internship">Magang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salary_range">Rentang Gaji</Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  placeholder="Contoh: Rp 5.000.000 - Rp 8.000.000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi Pekerjaan *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan tugas dan tanggung jawab..."
                rows={5}
                required
              />
            </div>

            <div>
              <Label htmlFor="requirements">Persyaratan *</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Jelaskan kualifikasi yang dibutuhkan..."
                rows={5}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Aktifkan lowongan</Label>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin/jobs">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
