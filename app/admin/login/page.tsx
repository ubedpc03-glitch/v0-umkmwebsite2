"use client"

import type React from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Shield, User, Lock } from "lucide-react"

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("") // using identifier instead of email to support both email and user ID
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createBrowserClient()
    setIsLoading(true)
    setError(null)

    try {
      const isEmail = identifier.includes("@")

      if (isEmail) {
        // Login with email
        const { error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        })
        if (error) throw error
      } else {
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", identifier)
          .single()

        if (userError || !userData) {
          throw new Error("User ID tidak ditemukan")
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password,
        })
        if (error) throw error
      }

      router.push("/admin")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center mb-6 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-800">Admin Panel</CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Masuk ke dashboard admin UMKM Berkah Jaya
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-slate-700 font-medium">
                  Email atau User ID
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="admin@umkm.com atau user123"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Memproses...
                  </div>
                ) : (
                  "Masuk ke Admin Panel"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-slate-200">
              <div className="space-y-2">
                <Link
                  href="/admin/create-auth-user"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 block"
                >
                  Belum ada admin? Buat admin pertama
                </Link>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200 block"
                >
                  ← Kembali ke Website Utama
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
