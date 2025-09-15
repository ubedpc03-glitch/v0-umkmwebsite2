"use client"

import type React from "react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  // const [user, setUser] = useState<User | null>(null)
  // const [loading, setLoading] = useState(true)
  // const router = useRouter()
  // const supabase = createClient()

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const {
  //         data: { user },
  //       } = await supabase.auth.getUser()

  //       if (!user) {
  //         router.push("/admin/login")
  //         return
  //       }

  //       // Check if user is admin
  //       const { data: adminProfile } = await supabase.from("admin_profiles").select("*").eq("id", user.id).single()

  //       if (!adminProfile) {
  //         router.push("/admin/login")
  //         return
  //       }

  //       setUser(user)
  //     } catch (error) {
  //       console.error("Auth check failed:", error)
  //       router.push("/admin/login")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   checkAuth()

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange(async (event, session) => {
  //     if (event === "SIGNED_OUT" || !session) {
  //       router.push("/admin/login")
  //     } else if (event === "SIGNED_IN" && session.user) {
  //       // Check admin status on sign in
  //       const { data: adminProfile } = await supabase
  //         .from("admin_profiles")
  //         .select("*")
  //         .eq("id", session.user.id)
  //         .single()

  //       if (!adminProfile) {
  //         await supabase.auth.signOut()
  //         router.push("/admin/login")
  //       } else {
  //         setUser(session.user)
  //       }
  //     }
  //   })

  //   return () => subscription.unsubscribe()
  // }, [router, supabase])

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //     </div>
  //   )
  // }

  // if (!user) {
  //   return null
  // }

  // Temporarily allow access without authentication
  return <>{children}</>
}
