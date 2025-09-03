"use client"

import { useState } from "react"
import SortableMediaGrid from "@/components/sortable-media-grid"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  name: string
  thumbnail?: string
}

const testMedia: MediaItem[] = [
  {
    id: "1",
    type: "image" as const,
    url: "/placeholder.svg",
    name: "Test Image 1",
  },
  {
    id: "2", 
    type: "video" as const,
    url: "/test-video.mp4",
    name: "Test Video 1",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "3",
    type: "image" as const,
    url: "/placeholder.svg",
    name: "Test Image 2",
  }
]

export default function DragDropTest() {
  const [media, setMedia] = useState(testMedia)

  const handleReorder = (newMedia: MediaItem[]) => {
    setMedia(newMedia)
    console.log("Media reordered:", newMedia)
  }

  const handleRemove = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id))
    console.log("Media removed:", id)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Drag and Drop Test</h1>
      <SortableMediaGrid
        media={media}
        onReorder={handleReorder}
        onRemove={handleRemove}
      />
    </div>
  )
}
