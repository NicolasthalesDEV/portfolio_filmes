"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin-dashboard"
import PageTemplate from "@/components/page-template"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const storedId = typeof window !== 'undefined' ? localStorage.getItem('adminId') : null
      if (!storedId) {
        router.push('/login')
        return
      }
      try {
        const response = await fetch(`/api/auth/user?id=${storedId}`)
        const result = await response.json()
        
        if (response.ok && result.success && result.user) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('adminId')
          router.push('/login')
        }
      } catch {
        localStorage.removeItem('adminId')
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Checking authentication...</div>
      </div>
    )
  }

  return (
    <>
      <AdminDashboard />
    </>
  )
}
