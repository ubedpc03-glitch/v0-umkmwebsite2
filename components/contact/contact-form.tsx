"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Send, MessageCircle, Phone } from "lucide-react"

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createBrowserClient()
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      })

      if (error) throw error

      setIsSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })

      toast({
        title: "Pesan Terkirim!",
        description: "Terima kasih telah menghubungi kami. Kami akan segera merespons.",
      })

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Gagal mengirim pesan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openWhatsApp = () => {
    const message = "Halo, saya ingin bertanya tentang produk UMKM Berkah Jaya"
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <span className="text-green-600 font-bold text-lg">✓</span>
            </div>
            <h3 className="text-lg font-semibold">Pesan Terkirim!</h3>
            <p className="text-muted-foreground">
              Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setIsSuccess(false)}>Kirim Pesan Lain</Button>
              <Button variant="outline" onClick={openWhatsApp}>
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kirim Pesan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+62 812 3456 7890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subjek *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Subjek pesan"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Pesan *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tulis pesan Anda di sini..."
                rows={5}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Mengirim..." : "Kirim Pesan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Contact Options */}
      <Card>
        <CardHeader>
          <CardTitle>Kontak Langsung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={openWhatsApp} className="h-auto p-4 bg-transparent">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Chat langsung dengan kami</p>
                </div>
              </div>
            </Button>
            <Button variant="outline" asChild className="h-auto p-4 bg-transparent">
              <a href="tel:+6281234567890">
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold">Telepon</p>
                    <p className="text-sm text-muted-foreground">+62 812 3456 7890</p>
                  </div>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
