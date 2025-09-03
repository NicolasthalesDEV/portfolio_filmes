"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Play, GripVertical } from "lucide-react"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  name: string
  thumbnail?: string
}

interface SortableMediaItemProps {
  media: MediaItem
  index: number
  onRemove: (id: string) => void
  toPublicUrl?: (url: string) => string
}

function SortableMediaItem({ media, index, onRemove, toPublicUrl }: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: media.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      <div className={`aspect-square bg-muted rounded-lg overflow-hidden relative transition-all duration-200 ${
        isDragging ? 'shadow-2xl rotate-2 scale-105' : 'shadow-sm'
      }`}>
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 bg-black/60 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          <GripVertical className="w-4 h-4 text-white" />
        </div>

        {/* Order indicator */}
        <div className="absolute top-2 right-2 bg-black/60 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-medium">
          {index + 1}
        </div>

        {/* Media content */}
        {media.type === "video" ? (
          media.thumbnail ? (
            <div className="relative w-full h-full">
              <img
                src={media.thumbnail}
                alt={`Video thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <Play className="w-8 h-8 text-foreground" />
            </div>
          )
        ) : (
          <img
            src={toPublicUrl ? toPublicUrl(media.url) : media.url || "/placeholder.svg"}
            alt={`Upload ${index + 1}`}
            className="w-full h-full object-cover"
          />
        )}

        {/* Remove button */}
        <button
          onClick={() => onRemove(media.id)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          ×
        </button>
      </div>
    </div>
  )
}

interface SortableMediaGridProps {
  media: MediaItem[]
  onReorder: (newMedia: MediaItem[]) => void
  onRemove: (id: string) => void
  toPublicUrl?: (url: string) => string
}

export default function SortableMediaGrid({
  media,
  onReorder,
  onRemove,
  toPublicUrl,
}: SortableMediaGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = media.findIndex((item) => item.id === active.id)
      const newIndex = media.findIndex((item) => item.id === over?.id)

      const newMedia = arrayMove(media, oldIndex, newIndex)
      onReorder(newMedia)
    }
  }

  if (media.length === 0) {
    return null
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
        <GripVertical className="w-4 h-4" />
        <span>Drag and drop to reorder photos and videos</span>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={media.map(item => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-4">
            {media.map((mediaItem, index) => (
              <SortableMediaItem
                key={mediaItem.id}
                media={mediaItem}
                index={index}
                onRemove={onRemove}
                toPublicUrl={toPublicUrl}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
