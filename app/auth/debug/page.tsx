"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const checkConnection = async () => {
    setLoading(true)
    try {
      console.log("[v0] Testing Supabase connection...")

      // Test basic connection
      const { data: testData, error: testError } = await supabase.from("admin_profiles").select("count").limit(1)

      console.log("[v0] Connection test:", { testData, testError })

      // Check current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      console.log("[v0] Current user:", { user, userError })

      // Check admin profiles
      const { data: profiles, error: profilesError } = await supabase.from("admin_profiles").select("*")

      console.log("[v0] Admin profiles:", { profiles, profilesError })

      setDebugInfo({
        connection: testError ? "Failed" : "Success",
        connectionError: testError?.message,
        currentUser: user,
        userError: userError?.message,
        adminProfiles: profiles,
        profilesError: profilesError?.message,
        envVars: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
        },
      })
    } catch (error) {
      console.log("[v0] Debug error:", error)
      setDebugInfo({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Debug Authentication</CardTitle>
          <CardDescription>Informasi debug untuk troubleshooting auth issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={checkConnection} disabled={loading} className="mb-4">
            {loading ? "Checking..." : "Refresh Debug Info"}
          </Button>

          {debugInfo && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
