import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Key, Database, User, Shield } from "lucide-react"

export default function AdminSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Admin UMKM</h1>
          <p className="text-gray-600">Informasi kredensial dan database untuk admin</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Kredensial Admin Default
              </CardTitle>
              <CardDescription>Gunakan kredensial ini untuk login pertama kali</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email:</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded border font-mono text-sm">admin@umkm.com</div>
              </div>
              <div>
                <Label>Password:</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded border font-mono text-sm">admin123456</div>
              </div>
              <div>
                <Label>Role:</Label>
                <div className="mt-1">
                  <Badge variant="secondary">Administrator</Badge>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Segera ganti password setelah login pertama untuk keamanan!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Database Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Informasi Database
              </CardTitle>
              <CardDescription>Database menggunakan Supabase yang sudah terintegrasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Provider:</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded border">Supabase (PostgreSQL)</div>
              </div>
              <div>
                <Label>Status:</Label>
                <div className="mt-1">
                  <Badge variant="default" className="bg-green-500">
                    Connected
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Tables:</Label>
                <div className="mt-1 text-sm text-gray-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>company_info</li>
                    <li>products & categories</li>
                    <li>gallery_images</li>
                    <li>online_shops</li>
                    <li>blog_articles</li>
                    <li>job_postings</li>
                    <li>contact_messages</li>
                    <li>admin_profiles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Steps */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Langkah Setup Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Jalankan semua script database yang tersedia</li>
                <li>
                  Buka halaman <code className="bg-gray-100 px-1 rounded">/admin/login</code>
                </li>
                <li>Klik "Daftar Admin Baru" untuk membuat akun admin pertama</li>
                <li>
                  Gunakan email: <code className="bg-gray-100 px-1 rounded">admin@umkm.com</code>
                </li>
                <li>
                  Gunakan password: <code className="bg-gray-100 px-1 rounded">admin123456</code>
                </li>
                <li>
                  Isi nama lengkap: <code className="bg-gray-100 px-1 rounded">Administrator UMKM</code>
                </li>
                <li>Setelah berhasil login, segera ganti password di pengaturan profil</li>
                <li>Mulai mengelola konten website melalui dashboard admin</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
