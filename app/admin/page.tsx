import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Users, MessageSquare, Briefcase, ShoppingCart, FileText } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()
  // if (!user) {
  //   redirect("/auth/login")
  // }

  // Fetch dashboard statistics
  const [
    { count: totalProducts },
    { count: totalCategories },
    { count: unreadMessages },
    { count: activeJobs },
    { count: jobApplications },
    { count: publishedArticles },
    { data: recentProducts },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("product_categories").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("job_postings").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("job_applications").select("*", { count: "exact", head: true }),
    supabase.from("blog_articles").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("products").select("name, created_at").order("created_at", { ascending: false }).limit(5),
    supabase
      .from("contact_messages")
      .select("name, subject, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      title: "Total Produk",
      value: totalProducts || 0,
      description: "Produk aktif di katalog",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Kategori Produk",
      value: totalCategories || 0,
      description: "Kategori yang tersedia",
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Pesan Belum Dibaca",
      value: unreadMessages || 0,
      description: "Pesan dari pelanggan",
      icon: MessageSquare,
      color: "text-orange-600",
    },
    {
      title: "Lowongan Aktif",
      value: activeJobs || 0,
      description: "Posisi yang dibuka",
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      title: "Aplikasi Kerja",
      value: jobApplications || 0,
      description: "Total lamaran masuk",
      icon: Users,
      color: "text-red-600",
    },
    {
      title: "Artikel Published",
      value: publishedArticles || 0,
      description: "Artikel blog aktif",
      icon: FileText,
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">Selamat datang di panel admin UMKM Berkah Jaya</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produk Terbaru</CardTitle>
            <CardDescription>5 produk yang baru ditambahkan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts && recentProducts.length > 0 ? (
                recentProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(product.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <Badge variant="secondary">Baru</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada produk</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Pesan Terbaru</CardTitle>
            <CardDescription>5 pesan terakhir dari pelanggan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages && recentMessages.length > 0 ? (
                recentMessages.map((message, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{message.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{message.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <Badge variant="outline">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Pesan
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada pesan</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Akses cepat ke fitur admin yang sering digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/products"
              className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Package className="h-8 w-8 mb-2 text-blue-600" />
              <span className="text-sm font-medium">Kelola Produk</span>
            </a>
            <a
              href="/admin/messages"
              className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <MessageSquare className="h-8 w-8 mb-2 text-orange-600" />
              <span className="text-sm font-medium">Pesan Masuk</span>
            </a>
            <a
              href="/admin/blog"
              className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <FileText className="h-8 w-8 mb-2 text-indigo-600" />
              <span className="text-sm font-medium">Kelola Blog</span>
            </a>
            <a
              href="/admin/jobs"
              className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Briefcase className="h-8 w-8 mb-2 text-purple-600" />
              <span className="text-sm font-medium">Lowongan Kerja</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
