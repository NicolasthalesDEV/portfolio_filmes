"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, Grid, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import ThemeToggle from "@/components/theme-toggle"
import LogoutButton from "@/components/logout-button"
import { useUserType } from "@/hooks/use-user-type"
import { PROJECT_CATEGORIES, DEFAULT_CATEGORY, CATEGORY_DISPLAY_NAMES } from "@/lib/categories"
import { useRouter, useSearchParams } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWorksDropdownOpen, setIsWorksDropdownOpen] = useState(false)
  const { userType, isAdmin } = useUserType()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentCategory = searchParams.get('category') || DEFAULT_CATEGORY

  const handleCategorySelect = (category: string) => {
    setIsWorksDropdownOpen(false)
    router.push(`/?category=${encodeURIComponent(category)}`)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsWorksDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-light tracking-wider text-foreground hover:text-muted-foreground transition-colors no-underline visited:text-foreground">
            © Portfolio
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {/* Works Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsWorksDropdownOpen(!isWorksDropdownOpen)}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Grid className="w-4 h-4" />
                Works
                <ChevronDown className={`w-4 h-4 transition-transform ${isWorksDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isWorksDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-md shadow-lg z-50"
                  >
                    <div className="py-2">
                      {PROJECT_CATEGORIES.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${currentCategory === category ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                            }`}
                        >
                          {CATEGORY_DISPLAY_NAMES[category]}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors no-underline visited:text-muted-foreground">
              About
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors no-underline visited:text-muted-foreground">
              Contact
            </Link>
            <ThemeToggle className="text-muted-foreground hover:text-foreground hover:bg-accent" />
            <LogoutButton />
            {isAdmin && (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-muted-foreground hover:bg-accent hover:text-foreground bg-transparent"
                >
                  <User className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-foreground">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden py-4 border-t border-border overflow-hidden"
            >
              <nav className="flex flex-col space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div>
                    <button
                      onClick={() => setIsWorksDropdownOpen(!isWorksDropdownOpen)}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 w-full text-left"
                    >
                      Works
                      <ChevronDown className={`w-4 h-4 transition-transform ${isWorksDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isWorksDropdownOpen && (
                      <div className="ml-4 mt-2 space-y-2">
                        {PROJECT_CATEGORIES.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              handleCategorySelect(category)
                              setIsMenuOpen(false)
                            }}
                            className={`block text-sm hover:text-foreground transition-colors ${currentCategory === category ? 'text-foreground' : 'text-muted-foreground'
                              }`}
                          >
                            {CATEGORY_DISPLAY_NAMES[category]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Logout</span>
                    <LogoutButton />
                  </div>
                </motion.div>
                {isAdmin && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                      Admin Login
                    </Link>
                  </motion.div>
                )}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-muted-foreground">Theme</span>
                  <ThemeToggle className="text-muted-foreground hover:text-foreground hover:bg-accent" />
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
