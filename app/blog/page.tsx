import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function BlogPage() {
  const supabase = createServerClient()

  const { data: articles } = await supabase
    .from("blog_articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">Blog & Artikel</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            Baca artikel terbaru, tips, dan berita seputar bisnis kami
          </p>
        </div>

        {/* Articles Grid */}
        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="aspect-video relative">
                  <Image
                    src={article.featured_image || "/placeholder.svg?height=300&width=400&query=blog article"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.created_at).toLocaleDateString("id-ID")}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {article.author || "Admin"}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">{article.title}</h3>

                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {article.excerpt || article.content?.substring(0, 150) + "..."}
                  </p>

                  {article.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Baca Selengkapnya →
                  </Link>
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Belum Ada Artikel</h3>
            <p className="text-slate-600">Artikel dan berita akan segera dipublikasikan</p>
          </div>
        )}
      </div>
    </div>
  )
}
