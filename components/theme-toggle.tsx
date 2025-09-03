"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export type ThemeToggleProps = {
  className?: string
  id?: string
  "aria-label"?: string
}

/**
 * Um botão acessível para alternar entre modo claro e escuro.
 * - Pronto para uso com next-themes (ThemeProvider).
 * - Pode ser usado em qualquer app Next.js; basta colocar dentro de um ThemeProvider.
 * - Client Component: usa estado e handlers de clique [^3].
 */
export default function ThemeToggle({
  className = "",
  id,
  "aria-label": ariaLabel = "Alternar tema",
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted ? resolvedTheme === "dark" : false

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      id={id}
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      aria-pressed={isDark}
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      className={cn("relative rounded-full", className)}
    >
      {/* Ícone Sol (visível no light) */}
      <Sun
        className={cn("h-5 w-5 rotate-0 scale-100 transition-all duration-300", isDark && "rotate-90 scale-0")}
        aria-hidden="true"
      />
      {/* Ícone Lua (visível no dark) */}
      <Moon
        className={cn("absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300", isDark && "rotate-0 scale-100")}
        aria-hidden="true"
      />
      <span className="sr-only">
        {isDark
          ? "Modo escuro ativo. Clique para alternar para claro."
          : "Modo claro ativo. Clique para alternar para escuro."}
      </span>
    </Button>
  )
}
