import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Helper: build public URL from storage path
function toPublicUrl(url?: string) {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url
  let path = url
  if (!path.startsWith('media/')) path = `media/${path.replace(/^\/*/, '')}`
  return path // TODO: map to storage CDN/base
}

export async function GET() {
  try {
  const projects = await prisma.project.findMany({ orderBy: { created_at: 'desc' }, take: 20 })

  const debug = (projects || []).map((p: any) => {
      const firstMedia = Array.isArray(p.media) && p.media.length > 0 ? p.media[0] : undefined
      return {
        id: p.id,
        title: p.title,
        visibility: p.visibility,
        thumbnail_raw: p.thumbnail,
        thumbnail_public: toPublicUrl(p.thumbnail),
        media_raw: p.media,
        media_first_raw: firstMedia,
        media_first_public: firstMedia ? { ...firstMedia, url_public: toPublicUrl(firstMedia.url), thumb_public: toPublicUrl(firstMedia.thumbnail) } : null,
        resolved_card_image: (firstMedia && firstMedia.type === 'video' && firstMedia.thumbnail)
          ? toPublicUrl(firstMedia.thumbnail)
          : toPublicUrl(firstMedia?.url || p.thumbnail),
        created_at: p.created_at,
      }
    })

    return NextResponse.json({ count: debug.length, projects: debug }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
