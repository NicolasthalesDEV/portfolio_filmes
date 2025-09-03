"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Remove os cookies de autenticação
    document.cookie = "site-authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "user-type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    
    // Redireciona para a página de auth
    router.push("/auth")
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className="border-border text-muted-foreground hover:bg-accent hover:text-foreground bg-transparent"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}
