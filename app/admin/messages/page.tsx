"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Mail, Phone, Calendar, Eye, Trash2, Award as MarkAsRead } from "lucide-react"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchMessages()

    // Set up real-time subscription
    const channel = supabase
      .channel("contact_messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, (payload) => {
        console.log("Real-time update:", payload)
        fetchMessages() // Refresh messages when there's a change
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Gagal memuat pesan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id)

      if (error) throw error

      setMessages(messages.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg)))

      toast({ title: "Berhasil", description: "Pesan ditandai sudah dibaca" })
    } catch (error) {
      console.error("Error marking as read:", error)
      toast({
        title: "Error",
        description: "Gagal menandai pesan",
        variant: "destructive",
      })
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return

    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id)

      if (error) throw error

      setMessages(messages.filter((msg) => msg.id !== id))
      toast({ title: "Berhasil", description: "Pesan berhasil dihapus" })
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus pesan",
        variant: "destructive",
      })
    }
  }

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Halo ${name}, terima kasih telah menghubungi UMKM Berkah Jaya. Kami akan membantu Anda.`
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const openEmail = (email: string, subject: string) => {
    const emailUrl = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`
    window.open(emailUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const unreadCount = messages.filter((msg) => !msg.is_read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pesan Masuk</h1>
          <p className="text-muted-foreground">Kelola pesan dari pelanggan ({unreadCount} belum dibaca)</p>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages?.map((message) => (
          <Card key={message.id} className={`${!message.is_read ? "border-primary bg-primary/5" : ""}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{message.name}</CardTitle>
                    {!message.is_read && <Badge variant="default">Baru</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{message.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Detail Pesan</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold">Nama</h4>
                            <p className="text-sm text-muted-foreground">{message.name}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Email</h4>
                            <p className="text-sm text-muted-foreground">{message.email}</p>
                          </div>
                          {message.phone && (
                            <div>
                              <h4 className="font-semibold">Telepon</h4>
                              <p className="text-sm text-muted-foreground">{message.phone}</p>
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold">Tanggal</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(message.created_at).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Subjek</h4>
                          <p className="text-sm text-muted-foreground">{message.subject}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Pesan</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{message.message}</p>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button size="sm" onClick={() => openEmail(message.email, message.subject)}>
                            <Mail className="h-4 w-4 mr-1" />
                            Balas Email
                          </Button>
                          {message.phone && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openWhatsApp(message.phone!, message.name)}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              WhatsApp
                            </Button>
                          )}
                          {!message.is_read && (
                            <Button size="sm" variant="outline" onClick={() => markAsRead(message.id)}>
                              <MarkAsRead className="h-4 w-4 mr-1" />
                              Tandai Dibaca
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {!message.is_read && (
                    <Button size="sm" variant="outline" onClick={() => markAsRead(message.id)}>
                      <MarkAsRead className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => deleteMessage(message.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed line-clamp-3">{message.message}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {message.email}
                  </div>
                  {message.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {message.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(message.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {messages?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada pesan</h3>
            <p className="text-muted-foreground text-center">Pesan dari pelanggan akan muncul di sini</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
