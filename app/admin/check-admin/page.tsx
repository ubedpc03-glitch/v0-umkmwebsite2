"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckAdmin() {
  const [adminExists, setAdminExists] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    checkAdminExists()
  }, [])

  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase.from("admin_profiles").select("id").limit(1)

      if (error) throw error

      setAdminExists(data && data.length > 0)
    } catch (error) {
      console.error("Error checking admin:", error)
      setAdminExists(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Mengecek status admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Status Admin</CardTitle>
          <CardDescription>Cek status administrator website UMKM</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {adminExists ? (
            <>
              <div className="text-green-600">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-lg font-semibold">Admin sudah ada!</p>
                <p className="text-sm text-gray-600">Anda bisa langsung login ke dashboard admin.</p>
              </div>
              <Link href="/admin/login">
                <Button className="w-full">Login Admin</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="text-orange-600">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-lg font-semibold">Belum ada admin!</p>
                <p className="text-sm text-gray-600">Anda perlu membuat akun administrator pertama.</p>
              </div>
              <Link href="/admin/setup-first-admin">
                <Button className="w-full">Buat Admin Pertama</Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
