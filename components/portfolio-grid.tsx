"use client"

import { useState, useEffect } from "react"
import { useUserType } from "@/hooks/use-user-type"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, ImageIcon } from "lucide-react"
import { getPageContent, defaultHomeContent } from "@/lib/contentApi"
import FadeIn from "./fade-in"
import StaggeredAnimation from "./staggered-animation"

interface Project {
  id: string
  title: string
  description: string
  category: string
  thumbnail: string
  visibility?: boolean // Add this field
  media?: Array<{
    id: string
    type: "image" | "video"
    url: string
    name: string
    thumbnail?: string
  }>
  hasVideo?: boolean // for backward compatibility
  created_at: string
}

export default function PortfolioGrid({ showAll = false }: { showAll?: boolean } = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const { userType, isLoading } = useUserType()
  const [homeContent, setHomeContent] = useState(defaultHomeContent)

  const buildPublicMediaUrl = (url?: string) => {
    if (!url) return ''
    if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) return url
    let path = url
    if (!path.startsWith('media/')) path = `media/${path.replace(/^\/*/, '')}`
    return path // TODO: map to new storage
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
        const hc = await getPageContent('home')
        if (hc?.content) {
          setHomeContent({ ...defaultHomeContent, ...hc.content })
        }
      } catch { }
    }
    load()
  }, [showAll, userType, isLoading])

  const getProjectImage = (project: Project) => {
    // TODO: map to future storage public URL
    const getPublicUrl = (url: string) => {
      if (!url) return undefined;
      // Já é URL completa ou asset local
      if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("/")) return url;
      // Constrói a URL pública a partir do path do Storage
      let path = url;
      if (!path.startsWith("media/")) path = `media/${path.replace(/^\/*/, "")}`;
      return path; // TODO replace with storage base url
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
    return "/placeholder.svg?height=300&width=400&text=Project+Image";
  }

  const isVideo = (project: Project) => {
    if (project.media && project.media.length > 0) {
      return project.media[0].type === "video"
    }
    return project.hasVideo || false
  }

  return (
    <div className="space-y-8">
      <FadeIn delay={0.2}>
        <div className="text-center space-y-4">
          {homeContent.titleType === 'logo' && homeContent.logoUrl ? (
            <div className="flex justify-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={buildPublicMediaUrl(homeContent.logoUrl)} alt={homeContent.titleText || 'Logo'} className="h-20 w-auto object-contain" />
            </div>
          ) : (
            <h1
              className="font-light tracking-wider mb-6"
              style={{
                fontFamily: homeContent.typography?.title?.fontFamily || 'inherit',
                fontSize: (homeContent.typography?.title?.fontSize || 64) + 'px'
              }}
            >
              {homeContent.titleText}
            </h1>
          )}
          {homeContent.subtitle && (
            <p
              className="text-muted-foreground max-w-2xl mx-auto"
              style={{
                fontFamily: homeContent.typography?.subtitle?.fontFamily || 'inherit',
                fontSize: (homeContent.typography?.subtitle?.fontSize || 22) + 'px'
              }}
            >
              {homeContent.subtitle}
            </p>
          )}
        </div>
      </FadeIn>

      <StaggeredAnimation className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
        {projects.map((project) => {
          const imageUrl = getProjectImage(project) || "/placeholder.svg";
          const hasVideo = isVideo(project);

          return (
            <Link key={project.id} href={`/project/${project.id}`}>
              <Card className="group bg-card/50 border-border hover:border-muted-foreground transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-primary/10">
                <motion.div layoutId={`card-${project.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <motion.img
                    src={imageUrl}
                    alt={project.title}
                    layoutId={`image-${project.id}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.svg?height=300&width=400&text=Failed+to+Load";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {hasVideo && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-background/80 rounded-full p-2 group-hover:bg-primary/80 transition-colors duration-300">
                        <Play className="w-4 h-4 text-foreground" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex justify-end items-center">
                      {project.media && project.media.length > 1 && (
                        <Badge variant="secondary" className="bg-background/90 text-foreground">
                          +{project.media.length - 1} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium text-foreground mb-2 group-hover:text-muted-foreground transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </StaggeredAnimation>

      {projects.length === 0 && (
        <FadeIn delay={0.3}>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <ImageIcon className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No projects found</p>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
