"use client"

import { ReactNode } from "react"
import dynamic from "next/dynamic"
const PageTransition = dynamic(() => import("./page-transition"), { ssr: false })
import Header from "./header"
import RouteProgress from "./route-progress"

interface PageTemplateProps {
  children: ReactNode
}

export default function PageTemplate({ children }: PageTemplateProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
  <RouteProgress />
      <Header />
      <PageTransition>
        <main className="container mx-auto px-4 py-4">
          {children}
        </main>
      </PageTransition>
    </div>
  )
}
