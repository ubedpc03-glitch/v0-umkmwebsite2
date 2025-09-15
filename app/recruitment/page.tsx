import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Users } from "lucide-react"

export default async function RecruitmentPage() {
  const supabase = createServerClient()

  const { data: jobs } = await supabase
    .from("job_postings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">Karir & Lowongan Kerja</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            Bergabunglah dengan tim kami dan kembangkan karir Anda bersama perusahaan yang berkembang
          </p>
        </div>

        {/* Job Listings */}
        {jobs && jobs.length > 0 ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {jobs.map((job) => (
              <Card key={job.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-slate-900 mb-2">{job.title}</h3>
                          <Badge variant="secondary" className="mb-4">
                            {job.department || "Umum"}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{job.location || "Jakarta"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{job.type || "Full Time"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">{job.salary_range || "Negotiable"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{job.experience_level || "Entry Level"}</span>
                        </div>
                      </div>

                      <div className="prose prose-slate max-w-none mb-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-3">Deskripsi Pekerjaan</h4>
                        <p className="text-slate-600 leading-relaxed">{job.description}</p>
                      </div>

                      {job.requirements && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-slate-900 mb-3">Persyaratan</h4>
                          <div className="text-slate-600">
                            {job.requirements.split("\n").map((req: string, index: number) => (
                              <p key={index} className="mb-1">
                                • {req}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:w-48 flex-shrink-0">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Lamar Sekarang
                      </Button>
                      <p className="text-xs text-slate-500 mt-2 text-center">
                        Deadline: {new Date(job.deadline).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Belum Ada Lowongan</h3>
            <p className="text-slate-600">Lowongan kerja akan segera dipublikasikan</p>
          </div>
        )}
      </div>
    </div>
  )
}
