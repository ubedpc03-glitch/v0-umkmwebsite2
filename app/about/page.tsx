import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Eye, Target } from "lucide-react"

export default function AboutPage() {
  const companyInfo = {
    name: "UMKM Indonesia",
    description: "Perusahaan UMKM yang berkomitmen memberikan produk berkualitas",
    profile:
      "Kami adalah perusahaan UMKM yang telah berpengalaman dalam menyediakan produk berkualitas tinggi. Dengan dedikasi dan inovasi, kami terus berkembang untuk memenuhi kebutuhan pelanggan.",
    vision: "Menjadi UMKM terdepan yang memberikan solusi inovatif dan berkualitas tinggi untuk kemajuan bersama.",
    mission:
      "Menghadirkan produk berkualitas dengan pelayanan terbaik, membangun kepercayaan pelanggan, dan berkontribusi positif bagi masyarakat.",
    address: "Jl. UMKM Sejahtera No. 123, Jakarta Selatan 12345",
    operating_hours: "Senin - Jumat: 08:00 - 17:00",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">Tentang {companyInfo.name}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">{companyInfo.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Company Profile */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">Profil Perusahaan</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">{companyInfo.profile}</p>
                </div>
              </CardContent>
            </Card>

            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Eye className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-slate-900">Visi</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{companyInfo.vision}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Target className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-slate-900">Misi</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{companyInfo.mission}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">Informasi Kontak</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">Alamat</h4>
                      <p className="text-slate-600">{companyInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">Jam Operasional</h4>
                      <div className="text-slate-600 space-y-1">
                        <p>{companyInfo.operating_hours}</p>
                        <p>Sabtu: 08:00 - 15:00</p>
                        <p>Minggu: Tutup</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Image */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{companyInfo.name.charAt(0)}</span>
                  </div>
                  <p className="text-slate-600">Foto Perusahaan</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
