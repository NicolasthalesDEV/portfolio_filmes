"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { defaultContactContent } from "@/lib/contentApi"
import PageTemplate from "@/components/page-template"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Send } from "lucide-react"

export default function ContactPage() {
  const [content, setContent] = useState(defaultContactContent)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content?type=contact')
        if (response.ok) {
          const pageContent = await response.json()
          if (pageContent?.content) {
            setContent(pageContent.content)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitStatus("error")
        console.error('Erro ao enviar mensagem:', result.error)
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PageTemplate>
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-foreground">Loading...</div>
          </div>
        </div>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate>
      <div className="max-w-6xl mx-auto">
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
          >{content.subtitle}</p>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h2
                  className="font-light mb-6"
                  style={{
                    fontFamily: content.typography?.sectionTitle?.fontFamily || 'inherit',
                    fontSize: (content.typography?.sectionTitle?.fontSize || 28) + 'px'
                  }}
                >{content.getInTouchTitle}</h2>
                <p
                  className="text-muted-foreground leading-relaxed mb-8"
                  style={{
                    fontFamily: content.typography?.sectionBody?.fontFamily || 'inherit',
                    fontSize: (content.typography?.sectionBody?.fontSize || 18) + 'px'
                  }}
                >
                  {content.getInTouchDescription}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3
                    className="font-light text-foreground mb-2"
                    style={{
                      fontFamily: content.typography?.name?.fontFamily || 'inherit',
                      fontSize: (content.typography?.name?.fontSize || 24) + 'px'
                    }}
                  >{content.personalInfo.name}</h3>
                  <p className="text-muted-foreground mb-1" style={{ fontFamily: content.typography?.small?.fontFamily || 'inherit', fontSize: (content.typography?.small?.fontSize || 16) + 'px' }}>{content.personalInfo.position}</p>
                  <p className="text-muted-foreground mb-6" style={{ fontFamily: content.typography?.small?.fontFamily || 'inherit', fontSize: (content.typography?.small?.fontSize || 16) + 'px' }}>{content.personalInfo.company}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <a href={`mailto:${content.personalInfo.email}`} className="text-foreground hover:text-muted-foreground transition-colors">
                      {content.personalInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-card/50 border-border">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        autoComplete="name"
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Subject *</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Subject"
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Message *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message..."
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground min-h-[120px]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
                      <p className="text-green-300 text-sm">Message sent successfully! I'll get back to you soon.</p>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                      <p className="text-red-300 text-sm">
                        Failed to send message. Please try again or email directly.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
    </PageTemplate>
  )
}
