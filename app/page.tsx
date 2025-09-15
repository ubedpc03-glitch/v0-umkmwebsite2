import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Star, Users, Award, Truck } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, product_categories(name)")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(4)

  // Fetch company info
  const { data: companyInfo } = await supabase.from("company_info").select("*").single()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit mx-auto lg:mx-0">
                  Produk Lokal Berkualitas
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-balance leading-tight">
                  {companyInfo?.name || "UMKM Berkah Jaya"}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto lg:mx-0">
                  {companyInfo?.description ||
                    "Usaha Mikro Kecil Menengah yang bergerak di bidang produk lokal berkualitas tinggi dengan harga terjangkau."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/products">
                    Lihat Produk <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                  <Link href="/about">Tentang Kami</Link>
                </Button>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="aspect-[4/3] md:aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/umkm-products-showcase.jpg"
                  alt="Produk UMKM Berkah Jaya"
                  className="rounded-xl object-cover w-full h-full"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance">Mengapa Memilih Kami?</h2>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Kami berkomitmen memberikan produk terbaik dengan pelayanan yang memuaskan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Kualitas Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Semua produk telah melalui kontrol kualitas yang ketat</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Pelayanan Ramah</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Tim customer service yang siap membantu Anda 24/7</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Harga Terjangkau</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Produk berkualitas dengan harga yang bersahabat</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Pengiriman Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Pengiriman ke seluruh Indonesia dengan packaging aman</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-12 md:py-16 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12 lg:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance">Produk Unggulan</h2>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Pilihan terbaik dari koleksi produk kami
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.image_url || `/placeholder.svg?height=300&width=300&query=${product.name}`}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-fit">
                        {product.product_categories?.name}
                      </Badge>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        Rp {product.price?.toLocaleString("id-ID")}
                      </span>
                      <Button size="sm" asChild>
                        <Link href={`/products/${product.id}`}>Detail</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8 lg:mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">
                  Lihat Semua Produk <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance">
                  Siap Berbelanja Produk Berkualitas?
                </h2>
                <p className="text-lg md:text-xl text-primary-foreground/80 text-pretty max-w-2xl mx-auto">
                  Jelajahi koleksi lengkap produk kami dan temukan yang sesuai dengan kebutuhan Anda
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
                    <Link href="/products">
                      Mulai Belanja <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/contact">Hubungi Kami</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
