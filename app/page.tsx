import { Suspense } from "react"
import PortfolioGrid from "@/components/portfolio-grid-clean"
import PageTemplate from "@/components/page-template"

interface HomePageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const selectedCategory = params.category

  return (
    <PageTemplate>
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <PortfolioGrid selectedCategory={selectedCategory} />
      </Suspense>
    </PageTemplate>
  )
}
