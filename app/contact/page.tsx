import { ContactForm } from "@/components/contact/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function ContactPage() {
  const supabase = await createClient()

  const { data: companyInfo } = await supabase.from("company_info").select("*").single()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <Badge variant="secondary" className="mx-auto">
            Hubungi Kami
          </Badge>
          <h1 className="text-4xl font-bold text-balance">Kontak UMKM Berkah Jaya</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Kami siap membantu Anda. Hubungi kami melalui form di bawah atau informasi kontak yang tersedia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Alamat</h3>
                    <p className="text-muted-foreground">
                      {companyInfo?.address || "Jl. Raya Berkah No. 123, Jakarta Selatan"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Telepon</h3>
                    <p className="text-muted-foreground">{companyInfo?.phone || "+62 21 1234 5678"}</p>
                    {companyInfo?.whatsapp && <p className="text-muted-foreground">WhatsApp: {companyInfo.whatsapp}</p>}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">{companyInfo?.email || "info@umkmberkahjaya.com"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Jam Operasional</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Senin - Jumat: 08:00 - 17:00</p>
                      <p>Sabtu: 08:00 - 15:00</p>
                      <p>Minggu: Tutup</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Lokasi Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Peta lokasi akan ditampilkan di sini</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
