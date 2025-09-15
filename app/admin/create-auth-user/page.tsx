"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createBrowserClient } from "@/lib/supabase/client"

export default function CreateAuthUserPage() {
  const [email, setEmail] = useState("admin@umkm.com")
  const [password, setPassword] = useState("admin123456")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const createAuthUser = async () => {
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const supabase = createBrowserClient()

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // Insert admin profile
        const { error: profileError } = await supabase.from("admin_profiles").insert({
          id: authData.user.id,
          full_name: "Administrator UMKM",
          role: "super_admin",
        })

        if (profileError) {
          console.error("Profile error:", profileError)
          // Continue anyway, profile might already exist
        }

        setMessage(
          "Admin user berhasil dibuat! Silakan cek email untuk verifikasi, atau langsung login jika sudah terverifikasi.",
        )
      }
    } catch (err: any) {
      console.error("Error creating admin:", err)
      setError(err.message || "Gagal membuat admin user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Buat Admin User</CardTitle>
          <CardDescription>Buat user admin pertama untuk sistem UMKM</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Admin</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@umkm.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </div>

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={createAuthUser} disabled={loading} className="w-full">
            {loading ? "Membuat Admin..." : "Buat Admin User"}
          </Button>

          <div className="text-center">
            <Button variant="link" asChild>
              <a href="/admin/login">Kembali ke Login</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
