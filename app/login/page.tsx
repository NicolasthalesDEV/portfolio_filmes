"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password })
      })

      const result = await response.json()

      if (response.ok && result.success && result.user) {
        localStorage.setItem("adminId", result.user.id)
        router.push("/admin")
      } else {
        alert(result.error || "Invalid credentials")
      }
    } catch (err: any) {
      alert(err.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Dark theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 dark:opacity-100 opacity-0 transition-opacity duration-300" />
      <div
        className="absolute inset-0 dark:opacity-100 opacity-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 65%)",
        }}
      />
      
      {/* Light theme background - Ultra clean */}
      <div className="absolute inset-0 bg-white dark:opacity-0 opacity-100 transition-opacity duration-300" />

      <Card className="w-full max-w-md bg-card border-border backdrop-blur-sm relative z-10 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-light text-foreground tracking-wide">Admin Access</CardTitle>
          <p className="text-muted-foreground text-sm">Enter your credentials to manage portfolio</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-muted/50 border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-muted/50 border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 transition-all duration-200"
            >
              {isLoading ? "Authenticating..." : "Access Dashboard"}
            </Button>

            <div className="text-center">
              <button type="button" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Forgot credentials?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
