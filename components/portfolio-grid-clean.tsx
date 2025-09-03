"use client"

import { useState, useEffect } from "react"
import { useUserType } from "@/hooks/use-user-type"
import Link from "next/link"
import { motion } from "framer-motion"
import { defaultHomeContent } from "@/lib/contentApi"
import FadeIn from "./fade-in"
import StaggeredAnimation from "./staggered-animation"
import { ImageIcon } from "lucide-react"
import { DEFAULT_CATEGORY } from "@/lib/categories"

interface Project {
  id: string
  title: string
  description: string
  category: string
  thumbnail: string
  visibility?: boolean
  media?: Array<{
    id: string
    type: "image" | "video"
    url: string
    name: string
    thumbnail?: string
  }>
  hasVideo?: boolean
  created_at: string
}

interface PortfolioGridProps {
  showAll?: boolean
  selectedCategory?: string
}

export default function PortfolioGridClean({ showAll = false, selectedCategory }: PortfolioGridProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const { userType, isLoading } = useUserType()
  const [homeContent, setHomeContent] = useState(defaultHomeContent)

  const currentCategory = selectedCategory || DEFAULT_CATEGORY

  const buildPublicMediaUrl = (url?: string) => {
    if (!url) return ''
    if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) return url
    let path = url
    if (!path.startsWith('media/')) path = `media/${path.replace(/^\/*/, '')}`
    return path
  }

  useEffect(() => {
    if (isLoading) return
    async function load() {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const result = await response.json()
          setProjects(result.data || [])
        } else {
          setProjects([])
        }
      } catch {
        setProjects([])
      }
      try {
        const response = await fetch('/api/content?type=home')
        if (response.ok) {
          const hc = await response.json()
          if (hc?.content) {
            setHomeContent({ ...defaultHomeContent, ...hc.content })
          }
        }
      } catch { }
    }
    load()
  }, [showAll, userType, isLoading, currentCategory])

  // Filter projects by category
  const filteredProjects = projects.filter(project => {
    if (showAll) return true
    return project.category === currentCategory
  })

  const getProjectImage = (project: Project) => {
    const getPublicUrl = (url: string) => {
      if (!url) return undefined;
      if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("/")) return url;
      let path = url;
      if (!path.startsWith("media/")) path = `media/${path.replace(/^\/*/, "")}`;
      return path;
    };

    if (project.media && project.media.length > 0) {
      const firstMedia = project.media[0];
      if (firstMedia.type === "video" && firstMedia.thumbnail) {
        return getPublicUrl(firstMedia.thumbnail);
      }
      if (firstMedia.url && firstMedia.url !== "/placeholder.png") {
        return getPublicUrl(firstMedia.url);
      }
    }
    if (project.thumbnail && project.thumbnail !== "/placeholder.png") {
      return getPublicUrl(project.thumbnail);
    }
    return "/placeholder.svg?height=400&width=600&text=Project+Image";
  }

  return (
    <div className="min-h-screen bg-black text-white portfolio-clean">
      <FadeIn delay={0.2}>
        <div className="text-center space-y-4 py-16">
          {homeContent.titleType === 'logo' && homeContent.logoUrl ? (
            <div className="flex justify-center mb-6">
              <img
                src={buildPublicMediaUrl(homeContent.logoUrl)}
                alt={homeContent.titleText || 'Logo'}
                className="h-20 w-auto object-contain"
              />
            </div>
          ) : (
            <h1
              className="font-light tracking-wider mb-6 text-white font-montserrat"
              style={{
                fontFamily: homeContent.typography?.title?.fontFamily || 'var(--font-montserrat)',
                fontSize: (homeContent.typography?.title?.fontSize || 64) + 'px'
              }}
            >
              {homeContent.titleText}
            </h1>
          )}
          {homeContent.subtitle && (
            <p
              className="text-gray-300 max-w-2xl mx-auto font-roboto"
              style={{
                fontFamily: homeContent.typography?.subtitle?.fontFamily || 'var(--font-roboto)',
                fontSize: (homeContent.typography?.subtitle?.fontSize || 22) + 'px'
              }}
            >
              {homeContent.subtitle}
            </p>
          )}
        </div>
      </FadeIn>

      <div className="container mx-auto px-8 md:px-12 lg:px-16 xl:px-20 overflow-visible">
        <StaggeredAnimation className="grid grid-cols-1 lg:grid-cols-2 gap-28 lg:gap-36 xl:gap-44 overflow-visible" staggerDelay={0.1}>
          {filteredProjects.map((project) => {
            const imageUrl = getProjectImage(project) || "/placeholder.svg";

            return (
              <motion.div
                key={project.id}
                className="portfolio-card group relative h-[400px] md:h-[450px] lg:h-[500px] overflow-visible cursor-pointer"
                layoutId={`card-${project.id}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/project/${project.id}`} className="block w-full h-full overflow-visible">
                  <div className="relative w-full h-full flex items-center overflow-visible">
                    {/* Image Container */}
                    <div className="image-container relative w-full h-full overflow-hidden">
                      <motion.img
                        src={imageUrl}
                        alt={project.title}
                        layoutId={`image-${project.id}`}
                        className="w-full h-full object-cover transition-all duration-500 ease-in-out filter grayscale group-hover:grayscale-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.svg?height=400&width=600&text=Failed+to+Load";
                        }}
                      />

                      {/* Category Text Overlay */}
                      <div className="category-text absolute bottom-8 left-0 right-0 opacity-0 group-hover:opacity-70 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                        <p className="text-white text-xs uppercase text-center font-light font-roboto tracking-[3px] md:tracking-[5px]">
                          {project.category}
                        </p>
                      </div>

                      {/* Remove or disable the color overlay */}
                      {/* <div className="color-overlay absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-10" /> */}
                    </div>

                    {/* Title Box - Positioned to slide completely outside */}
                    <div className="title-box absolute right-[-250px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-[-200px] transition-all duration-300 z-50">
                      {/* Separator Line */}
                      <div className="separator-line w-12 h-px bg-black mb-4 relative left-[-10px] hidden md:block" />

                      {/* Project Title */}
                      <h3 className="whitespace-nowrap">
                        <span className="text-white text-lg md:text-xl lg:text-2xl font-semibold font-montserrat hover:text-white transition-colors duration-200">
                          {project.title}
                        </span>
                      </h3>

                      {/* Title Underline */}
                      <div className="w-16 h-0.5 bg-red-500 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </StaggeredAnimation>

        {projects.length === 0 && (
          <FadeIn delay={0.3}>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-roboto">No projects found</p>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
