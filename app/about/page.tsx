"use client"

import { useEffect, useState } from "react"
import PageTemplate from "@/components/page-template"
import { defaultAboutContent } from "@/lib/contentApi"

export default function AboutPage() {
  const [content, setContent] = useState(defaultAboutContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content?type=about')
        if (response.ok) {
          const pageContent = await response.json()
          if (pageContent?.content) {
            setContent({ ...defaultAboutContent, ...pageContent.content, typography: { ...defaultAboutContent.typography, ...(pageContent.content.typography||{}) } })
          }
        }
      } catch (error) {
        console.warn('Could not load about content from database, using default:', error)
        // Usar conteúdo padrão se houver erro (ex: tabela não existe)
        setContent(defaultAboutContent)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [])

  if (loading) {
    return (
      <PageTemplate>
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-foreground">Loading...</div>
          </div>
        </div>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1
            className="font-light tracking-wider mb-6"
            style={{
              fontFamily: content.typography?.title?.fontFamily || 'inherit',
              fontSize: (content.typography?.title?.fontSize || 56) + 'px'
            }}
          >{content.title}</h1>
          <p
            className="text-muted-foreground max-w-2xl mx-auto"
            style={{
              fontFamily: content.typography?.subtitle?.fontFamily || 'inherit',
              fontSize: (content.typography?.subtitle?.fontSize || 20) + 'px'
            }}
          >
            {content.subtitle}
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {content.photo && (
                <div className="md:w-1/3 flex justify-center md:justify-start">
                  <img 
                    src={content.photo} 
                    alt={content.name} 
                    className="rounded-lg shadow-lg w-64 h-64 object-cover"
                  />
                </div>
              )}
              <div className={`${content.photo ? 'md:w-2/3' : 'w-full'}`}>
                <h2
                  className="font-light mb-6 text-foreground"
                  style={{
                    fontFamily: content.typography?.name?.fontFamily || 'inherit',
                    fontSize: (content.typography?.name?.fontSize || 32) + 'px'
                  }}
                >{content.name}</h2>
              <div
                className="text-muted-foreground leading-relaxed space-y-6"
                style={{
                  fontFamily: content.typography?.body?.fontFamily || 'inherit',
                  fontSize: (content.typography?.body?.fontSize || 18) + 'px'
                }}
              >
                {content.paragraphs?.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}

                {content.learningsTitle && content.learnings && (
                  <div className="pt-4">
                    <h3
                      className="font-medium text-foreground mb-4"
                      style={{
                        fontFamily: content.typography?.subheading?.fontFamily || 'inherit',
                        fontSize: (content.typography?.subheading?.fontSize || 22) + 'px'
                      }}
                    >{content.learningsTitle}</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      {content.learnings.map((learning: string, index: number) => (
                        <li key={index}>• {learning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {content.closingParagraphs?.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}

                {content.finalMessage && (
                  <p
                    className="text-foreground font-medium pt-4"
                    style={{
                      fontFamily: content.typography?.finalMessage?.fontFamily || 'inherit',
                      fontSize: (content.typography?.finalMessage?.fontSize || 22) + 'px'
                    }}
                  >{content.finalMessage}</p>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}
