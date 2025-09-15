"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.from("blog_articles").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching posts:", error)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const togglePublished = async (id: string, published: boolean) => {
    const supabase = createBrowserClient()
    const { error } = await supabase
      .from("blog_articles")
      .update({
        is_published: !published,
        published_at: !published ? new Date().toISOString() : null,
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating post:", error)
    } else {
      fetchPosts()
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return

    const supabase = createBrowserClient()
    const { error } = await supabase.from("blog_articles").delete().eq("id", id)

    if (error) {
      console.error("Error deleting post:", error)
    } else {
      fetchPosts()
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Blog</h1>
          <p className="text-muted-foreground">Kelola artikel dan konten blog</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Artikel Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
          <CardDescription>Total {posts.length} artikel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{post.title}</h3>
                    <Badge variant={post.is_published ? "default" : "secondary"}>
                      {post.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground">
                    Dibuat: {new Date(post.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/blog/${post.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => togglePublished(post.id, post.is_published)}>
                    {post.is_published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deletePost(post.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "Tidak ada artikel yang ditemukan" : "Belum ada artikel"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
