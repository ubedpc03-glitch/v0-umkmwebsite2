import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

export default async function OnlineShopsPage() {
  const supabase = createServerClient()

  const { data: onlineShops } = await supabase.from("online_shops").select("*").eq("is_active", true).order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">Toko Online Kami</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            Temukan produk kami di berbagai platform e-commerce terpercaya
          </p>
        </div>

        {/* Online Shops Grid */}
        {onlineShops && onlineShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {onlineShops.map((shop) => (
              <Card key={shop.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    {shop.logo_url ? (
                      <Image
                        src={shop.logo_url || "/placeholder.svg"}
                        alt={`${shop.name} logo`}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{shop.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{shop.name}</h3>

                  {shop.description && <p className="text-slate-600 mb-4 text-sm">{shop.description}</p>}

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <a
                      href={shop.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Kunjungi Toko
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Belum Ada Toko Online</h3>
            <p className="text-slate-600">Link toko online akan segera ditambahkan</p>
          </div>
        )}
      </div>
    </div>
  )
}
