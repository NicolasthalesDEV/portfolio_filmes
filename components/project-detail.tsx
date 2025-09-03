"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Download, Share2 } from "lucide-react"

interface ProjectMedia {
  id: string
  type: "image" | "video"
  url: string
  caption?: string
}

interface Project {
  id: string
  title: string
  description: string
  category: string
  thumbnail: string
  media: ProjectMedia[]
  fullDescription: string
  created_at: string
  client?: string
  role?: string
  tools?: string[]
}

interface ProjectDetailProps {
  projectId: string
}

export default function ProjectDetail({ projectId }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const router = useRouter()
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  // Build a public URL from a stored storage path (e.g., media/projects/xyz.png)
  const getPublicUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("/")) return url;
    let path = url;
    if (!path.startsWith("media/")) path = `media/${path.replace(/^\/*/, "")}`;
    return path; // TODO: real storage URL
  };

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch('/api/projects')
        let data = []
        if (response.ok) {
          const result = await response.json()
          data = result.data || []
        }
        const foundProject = data.find((p: any) => p.id === projectId);
        if (foundProject) {
          setProject({
            ...foundProject,
            fullDescription: foundProject.description,
            client: foundProject.client || "Sample Client",
            role: foundProject.role || "Creative Director",
            tools: foundProject.tools || ["Photoshop", "After Effects", "Cinema 4D"],
            media: foundProject.media || [
              {
                id: "1",
                type: "image",
                url: foundProject.thumbnail,
              },
            ],
          });
        }
      } catch (err) {
        setProject(null);
      }
    }
    fetchProject();
  }, [projectId]);

  if (!project) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white">Loading project...</div>
      </div>
    )
  }

  const current = project.media?.[currentMediaIndex]

  return (
    <div>
      <Button onClick={goBack} variant="ghost" className="mb-8 text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Portfolio
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <motion.div layoutId={`card-${project.id}`} className="relative aspect-[16/10] bg-gray-900 rounded-lg overflow-hidden">
            {current?.type === "video" ? (
              (current.url || "").includes("vimeo.com") ? (
                <iframe
                  src={(current.url || "").replace("vimeo.com/", "player.vimeo.com/video/")}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={getPublicUrl(current?.url)}
                  controls
                  className="w-full h-full object-cover"
                  poster={getPublicUrl(project.thumbnail)}
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : (((current?.url || project.thumbnail) as string).startsWith("blob:") || ((current?.url || project.thumbnail) as string).startsWith("data:")) ? (
              <motion.img layoutId={`image-${project.id}`}
                src={(current?.url || project.thumbnail) as string}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.div className="absolute inset-0">
                <Image
                  src={getPublicUrl(current?.url || project.thumbnail)}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </motion.div>
            )}
          </motion.div>

          {project.media.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {project.media.map((media, index) => (
                <button
                  key={media.id}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === currentMediaIndex ? "border-white" : "border-gray-600"
                    }`}
                >
                  {media.type === "video" ? (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  ) : media.url.startsWith("blob:") || media.url.startsWith("data:") ? (
                    <img
                      src={media.url || "/placeholder.svg"}
                      alt={`${project.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={getPublicUrl(media.url) || "/placeholder.png"}
                      alt={`${project.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                  {media.type === "video" && (
                    <div className="absolute top-1 right-1">
                      <div className="bg-black/80 rounded-full p-1">
                        <Play className="w-2 h-2 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {project.media[currentMediaIndex]?.caption && (
            <p className="text-gray-400 text-sm italic">{project.media[currentMediaIndex].caption}</p>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-light mb-4">{project.title}</h1>
            <p className="text-gray-300 leading-relaxed">{project.fullDescription}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">DATE</h3>
            <p className="text-white">
              {new Date(project.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-white hover:text-black bg-transparent"
              onClick={async () => {
                const shareData = {
                  title: project.title,
                  text: project.description,
                  url: window.location.href,
                }

                try {
                  if (navigator.share && navigator.canShare?.(shareData)) {
                    await navigator.share(shareData)
                  } else {
                    // Fallback: copy link
                    await navigator.clipboard.writeText(shareData.url)
                    alert("Link copied to clipboard!")
                  }
                } catch (error) {
                  // If user cancels share or sharing isn’t allowed, fallback
                  await navigator.clipboard.writeText(shareData.url)
                  alert("Link copied to clipboard!")
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-white hover:text-black bg-transparent"
              onClick={() => {
                const currentMedia = project.media[currentMediaIndex]
                if (currentMedia?.url) {
                  const link = document.createElement("a")
                  link.href = currentMedia.url
                  link.download = `${project.title}_${currentMedia.type === "video" ? "video" : "image"}`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
