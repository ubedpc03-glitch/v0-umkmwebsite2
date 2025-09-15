import { createServerClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default async function GalleryPage() {
  const supabase = await createServerClient()

  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">Galeri Kami</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            Lihat koleksi foto dan dokumentasi perjalanan bisnis kami
          </p>
        </div>

        {/* Gallery Grid */}
        {galleryItems && galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <Card
                key={item.id}
                className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-square relative">
                  <Image
                    src={item.image_url || "/placeholder.svg?height=400&width=400&query=gallery photo"}
                    alt={item.title || "Gallery image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {item.title && (
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                    {item.description && <p className="text-sm text-slate-600">{item.description}</p>}
                  </div>
                )}
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Galeri Kosong</h3>
            <p className="text-slate-600">Belum ada foto yang ditambahkan ke galeri</p>
          </div>
        )}
      </div>
    </div>
  )
}
