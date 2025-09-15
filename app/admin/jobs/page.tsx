"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Users } from "lucide-react"
import Link from "next/link"

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string
  salary_range: string
  is_active: boolean
  created_at: string
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.from("job_postings").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching jobs:", error)
    } else {
      setJobs(data || [])
    }
    setLoading(false)
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleActive = async (id: string, isActive: boolean) => {
    const supabase = createBrowserClient()
    const { error } = await supabase.from("job_postings").update({ is_active: !isActive }).eq("id", id)

    if (error) {
      console.error("Error updating job:", error)
    } else {
      fetchJobs()
    }
  }

  const deleteJob = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) return

    const supabase = createBrowserClient()
    const { error } = await supabase.from("job_postings").delete().eq("id", id)

    if (error) {
      console.error("Error deleting job:", error)
    } else {
      fetchJobs()
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Lowongan Kerja</h1>
          <p className="text-muted-foreground">Kelola posting lowongan kerja</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Lowongan Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Lowongan</CardTitle>
          <CardDescription>Total {jobs.length} lowongan kerja</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari lowongan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{job.title}</h3>
                    <Badge variant={job.is_active ? "default" : "secondary"}>
                      {job.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {job.department} • {job.location}
                  </p>
                  <p className="text-sm text-muted-foreground">Gaji: {job.salary_range}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/applications?job_id=${job.id}`}>
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/jobs/${job.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => toggleActive(job.id, job.is_active)}>
                    {job.is_active ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteJob(job.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "Tidak ada lowongan yang ditemukan" : "Belum ada lowongan kerja"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
