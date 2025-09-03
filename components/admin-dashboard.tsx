"use client"

import { useState, useEffect } from "react"
// TODO: Implement real object storage (S3, Cloudflare R2, etc.)
async function uploadMediaToStorage(file: File, folder: string = 'projects') {
  // Placeholder: for now convert file to base64 data URL (NOT for production)
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const ext = file.name.split('.').pop()
  return `data:${file.type || 'application/octet-stream'};base64,${base64}`
}
import { defaultAboutContent, defaultContactContent, defaultHomeContent } from "@/lib/contentApi"
import { AVAILABLE_FONTS, fontFamilyMap } from "@/lib/fonts"
import { PROJECT_CATEGORIES, DEFAULT_CATEGORY, CATEGORY_DISPLAY_NAMES } from "@/lib/categories"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash2, LogOut, Upload, Eye, EyeOff, Plus, Play, BarChart3, Settings, Users, FolderOpen, Home, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { useUserType } from "@/hooks/use-user-type"
import SortableMediaGrid from "@/components/sortable-media-grid"

interface Project {
  id: string
  title: string
  description: string
  category: string
  thumbnail: string
  visibility: boolean
  media: Array<{
    id: string
    type: "image" | "video"
    url: string
    name: string
    thumbnail?: string
  }>
  createdAt?: string
  created_at?: string
}

export default function AdminDashboard() {
  const buildPublicMediaUrl = (url?: string) => {
    if (!url) return ''
    if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) return url
    let path = url
    if (!path.startsWith('media/')) path = `media/${path.replace(/^\/*/, '')}`
    return path // TODO storage public URL
  }
  const [projects, setProjects] = useState<Project[]>([])
  const [activeTab, setActiveTab] = useState("projects")
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [aboutContent, setAboutContent] = useState(defaultAboutContent)
  const [contactContent, setContactContent] = useState(defaultContactContent)
  const [homeContent, setHomeContent] = useState(defaultHomeContent)
  const [showHomePreview, setShowHomePreview] = useState(false)
  const [showAboutPreview, setShowAboutPreview] = useState(false)
  const [showContactPreview, setShowContactPreview] = useState(false)
  const { userType } = useUserType()

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: DEFAULT_CATEGORY,
    thumbnail: "",
    visibility: true,
    media: [] as Array<{
      id: string
      type: "image" | "video"
      url: string
      name: string
      thumbnail?: string
    }>,
  })
  const [vimeoLinks, setVimeoLinks] = useState("")  // Estado para links do Vimeo
  const [editVimeoLinks, setEditVimeoLinks] = useState("")  // Estado para links do Vimeo na edição
  const [isProcessingVimeo, setIsProcessingVimeo] = useState(false)  // Loading state para Vimeo
  const [isProcessingEditVimeo, setIsProcessingEditVimeo] = useState(false)  // Loading state para Vimeo na edição
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Funções para chamar as APIs
  const apiGetProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const result = await response.json()
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Error fetching projects')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }

  const apiAddProject = async (project: any) => {
    try {
      const response = await fetch('/api/projects/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      })
      const result = await response.json()
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Error adding project')
      }
    } catch (error) {
      console.error('Error adding project:', error)
      throw error
    }
  }

  const apiUpdateProject = async (id: string, project: any) => {
    try {
      const response = await fetch('/api/projects/manage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...project }),
      })
      const result = await response.json()
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Error updating project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  const apiDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/manage?id=${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Error deleting project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  // Função para verificar se há dados no formulário
  const hasFormData = () => {
    return newProject.title.trim() !== "" ||
      newProject.description.trim() !== "" ||
      newProject.media.length > 0 ||
      vimeoLinks.trim() !== ""
  }

  // Função para extrair thumbnail do Vimeo
  const getVimeoThumbnail = async (vimeoUrl: string): Promise<string | undefined> => {
    try {
      // Extrair ID do vídeo do Vimeo da URL
      const vimeoId = vimeoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      if (!vimeoId) return undefined;

      // Fazer requisição para a API do Vimeo para obter dados do vídeo
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`);
      const data = await response.json();

      // Retornar a URL da thumbnail
      return data.thumbnail_url || undefined;
    } catch (error) {
      console.error('Erro ao obter thumbnail do Vimeo:', error);
      return undefined;
    }
  };

  // Função para processar links do Vimeo na edição
  const processEditVimeoLinks = async () => {
    if (!editVimeoLinks.trim() || !editingProject) return

    setIsProcessingEditVimeo(true);
    try {
      const links = editVimeoLinks.split('\n').filter(link => link.trim() !== '')
      const vimeoMedia = await Promise.all(links.map(async (link, index) => {
        const thumbnail = await getVimeoThumbnail(link.trim());
        return {
          id: `vimeo-edit-${Date.now()}-${index}`,
          type: "video" as const,
          url: link.trim(),
          name: `Vimeo Video ${index + 1}`,
          thumbnail: thumbnail
        };
      }));

      setEditingProject(prev => prev ? ({
        ...prev,
        media: [...prev.media, ...vimeoMedia]
      }) : null)

      setEditVimeoLinks("")  // Limpa o campo após adicionar
    } catch (error) {
      console.error('Erro ao processar vídeos do Vimeo:', error);
      alert('Erro ao processar alguns vídeos do Vimeo');
    } finally {
      setIsProcessingEditVimeo(false);
    }
  }

  // Função para processar links do Vimeo
  const processVimeoLinks = async () => {
    if (!vimeoLinks.trim()) return

    setIsProcessingVimeo(true);
    try {
      const links = vimeoLinks.split('\n').filter(link => link.trim() !== '')
      const vimeoMedia = await Promise.all(links.map(async (link, index) => {
        const thumbnail = await getVimeoThumbnail(link.trim());
        return {
          id: `vimeo-${Date.now()}-${index}`,
          type: "video" as const,
          url: link.trim(),
          name: `Vimeo Video ${index + 1}`,
          thumbnail: thumbnail
        };
      }));

      setNewProject(prev => ({
        ...prev,
        media: [...prev.media, ...vimeoMedia]
      }))

      setVimeoLinks("")  // Limpa o campo após adicionar
    } catch (error) {
      console.error('Erro ao processar vídeos do Vimeo:', error);
      alert('Erro ao processar alguns vídeos do Vimeo');
    } finally {
      setIsProcessingVimeo(false);
    }
  }

  // Função para controlar o fechamento do dialog de adicionar
  const handleAddDialogClose = (open: boolean) => {
    if (!open && hasFormData()) {
      // Se tentando fechar e há dados, confirma primeiro
      const confirmed = window.confirm(
        "Are you sure you want to close? All unsaved changes will be lost."
      )
      if (confirmed) {
        // Reset o formulário e fecha
        setNewProject({
          title: "",
          description: "",
          category: DEFAULT_CATEGORY,
          thumbnail: "",
          visibility: true,
          media: []
        })
        setVimeoLinks("")  // Reset Vimeo links
        setIsProcessingVimeo(false);  // Reset loading state
        setIsAddDialogOpen(false)
      }
      // Se não confirmou, não faz nada (mantém aberto)
    } else {
      // Se não há dados ou tentando abrir, permite normalmente
      setIsAddDialogOpen(open)
    }
  }

  // Função para controlar o fechamento do dialog de edição
  const handleEditDialogClose = (open: boolean) => {
    if (!open && editingProject) {
      // Se tentando fechar e há projeto sendo editado, confirma primeiro
      const confirmed = window.confirm(
        "Are you sure you want to close? All unsaved changes will be lost."
      )
      if (confirmed) {
        setEditingProject(null)
        setEditVimeoLinks("")  // Reset Vimeo links
        setIsProcessingEditVimeo(false);  // Reset loading state
        setIsEditDialogOpen(false)
      }
      // Se não confirmou, não faz nada (mantém aberto)
    } else {
      // Se não há projeto sendo editado ou tentando abrir, permite normalmente
      setIsEditDialogOpen(open)
    }
  }

  const formatDate = (project: any) => {
    const dateValue = project.created_at || project.createdAt;
    if (!dateValue) return 'Unknown';

    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Invalid Date';

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const toPublicUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("/")) return url;
    let path = url;
    if (!path.startsWith("media/")) path = `media/${path.replace(/^\/*/, "")}`;
    return path; // TODO storage public URL
  };

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return;
    async function fetchProjects() {
      try {
        const data = await apiGetProjects();
        setProjects(data || []);
      } catch (err) {
        setProjects([]);
      }
    }

    async function loadPageContents() {
      try {
        const response = await fetch('/api/content?type=home')
        if (response.ok) {
          const homeData = await response.json()
          if (homeData?.content) {
            setHomeContent({ ...defaultHomeContent, ...homeData.content })
          }
        }
      } catch { }
      try {
        // Carregar conteúdo About
        const aboutResponse = await fetch('/api/content?type=about')
        if (aboutResponse.ok) {
          const aboutData = await aboutResponse.json()
          if (aboutData?.content) {
            setAboutContent({ ...defaultAboutContent, ...aboutData.content, typography: { ...defaultAboutContent.typography, ...(aboutData.content.typography || {}) } });
          }
        }

        // Carregar conteúdo Contact
        const contactResponse = await fetch('/api/content?type=contact')
        if (contactResponse.ok) {
          const contactData = await contactResponse.json()
          if (contactData?.content) {
            setContactContent({ ...defaultContactContent, ...contactData.content, typography: { ...defaultContactContent.typography, ...(contactData.content.typography || {}) } });
          }
        }
      } catch (err) {
        console.error('Error loading page contents:', err);
      }
    }

    fetchProjects();
    loadPageContents();
  }, [isClient])

  if (!isClient) return null;

  const generateVideoThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      video.addEventListener("loadedmetadata", () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        video.currentTime = 1
      })

      video.addEventListener("seeked", () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8)
          resolve(thumbnailDataUrl)
        } else {
          reject(new Error("Could not get canvas context"))
        }
      })

      video.addEventListener("error", () => {
        reject(new Error("Error loading video"))
      })

      video.src = URL.createObjectURL(videoFile)
      video.load()
    })
  }

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) {
      alert("Please fill in all required fields")
      return
    }
    try {
      const projectToSave = {
        ...newProject,
        category: newProject.category,
        thumbnail: newProject.thumbnail || "/placeholder.png",
        media: newProject.media || [],
        visibility: newProject.visibility,
        created_at: new Date().toISOString(),
      };
      await apiAddProject(projectToSave);
      const data = await apiGetProjects();
      setProjects(data || []);
      setNewProject({ title: "", description: "", category: DEFAULT_CATEGORY, thumbnail: "", visibility: true, media: [] });
      setVimeoLinks("");  // Reset Vimeo links
      setIsProcessingVimeo(false);  // Reset loading state
      setIsAddDialogOpen(false);
    } catch (err: any) {
      alert("Erro ao adicionar projeto: " + (err?.message || err));
    }
  }

  const handleEditProject = async () => {
    if (!editingProject) return;
    try {
      await apiUpdateProject(editingProject.id, editingProject);
      const data = await apiGetProjects();
      setProjects(data || []);
      setEditingProject(null);
      setEditVimeoLinks("");  // Reset Vimeo links
      setIsProcessingEditVimeo(false);  // Reset loading state
      setIsEditDialogOpen(false); // Explicitly close the dialog
    } catch (err) {
      alert("Erro ao editar projeto");
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await apiDeleteProject(id);
        const data = await apiGetProjects();
        setProjects(data || []);
      } catch (err) {
        alert("Erro ao deletar projeto");
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminId")
    router.push("/")
  }

  const handleFileUpload = async (files: FileList, isEditing = false) => {
    const fileArray = Array.from(files)
    for (const file of fileArray) {
      try {
        const path = await uploadMediaToStorage(file, 'projects');
        const newMedia: {
          id: string
          type: "image" | "video"
          url: string
          name: string
          thumbnail?: string
        } = {
          id: Date.now().toString() + Math.random(),
          type: file.type.startsWith("video/") ? ("video" as const) : ("image" as const),
          url: path,
          name: file.name,
        }

        if (file.type.startsWith("video/")) {
          try {
            const thumbnail = await generateVideoThumbnail(file)
            newMedia.thumbnail = thumbnail
          } catch (error) {
            newMedia.thumbnail = "/placeholder.svg?height=300&width=400&text=Video+Thumbnail"
          }
        }

        if (isEditing && editingProject) {
          setEditingProject((prev) => ({
            ...prev!,
            media: [...(prev!.media || []), newMedia],
            thumbnail: prev!.thumbnail || newMedia.thumbnail || newMedia.url,
          }))
        } else {
          setNewProject((prev) => ({
            ...prev,
            media: [...prev.media, newMedia],
            thumbnail: prev.thumbnail || newMedia.thumbnail || newMedia.url,
          }))
        }
      } catch (error: any) {
        alert('Erro ao fazer upload do arquivo: ' + (error?.message || error));
      }
    }
  }

  const handleSaveAbout = async () => {
    try {
      const response = await fetch('/api/content/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageType: 'about', content: aboutContent })
      })

      if (response.ok) {
        alert("About content saved successfully!");
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving about content:', error);
      alert("Error saving about content. Please try again.");
    }
  }

  const handleSaveContact = async () => {
    try {
      const response = await fetch('/api/content/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageType: 'contact', content: contactContent })
      })

      if (response.ok) {
        alert("Contact content saved successfully!");
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving contact content:', error);
      alert("Error saving contact content. Please try again.");
    }
  }

  const handleSaveHome = async () => {
    try {
      const response = await fetch('/api/content/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageType: 'home', content: homeContent })
      })

      if (response.ok) {
        alert("Home content saved successfully!");
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving home content:', error);
      alert("Error saving home content. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex relative">
      {/* Main Content */}
      <div className={`flex-1 ${rightSidebarOpen ? 'mr-80' : 'mr-16'} transition-all duration-300`}>
        <div className="border-b border-border">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-light">Admin Dashboard</h1>
              </div>
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                {activeTab === "projects" && "Manage Projects"}
                {activeTab === "about" && "Edit About"}
                {activeTab === "contact" && "Edit Contact"}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle className="text-muted-foreground hover:text-foreground hover:bg-accent" />
              <Button
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:bg-accent bg-transparent"
              >
                {rightSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {rightSidebarOpen ? "Hide Panel" : "Show Panel"}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-border text-muted-foreground hover:bg-destructive hover:border-destructive bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          {activeTab === "projects" && (
            <div>
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-light mb-2">Portfolio Management</h2>
                    <p className="text-muted-foreground">Manage your creative projects</p>
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogClose}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border text-foreground max-w-2xl max-h-[90vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Add New Project</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-100px)] pr-2">
                        <div>
                          <label className="block text-sm font-medium mb-2">Title *</label>
                          <Input
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            className="bg-muted border-border text-foreground"
                            placeholder="Enter project title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Description *</label>
                          <Textarea
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            className="bg-muted border-border text-foreground min-h-[100px]"
                            placeholder="Describe your project"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Category *</label>
                          <select
                            value={newProject.category}
                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value as typeof DEFAULT_CATEGORY })}
                            className="w-full bg-muted border border-border rounded px-3 py-2 text-foreground"
                          >
                            {PROJECT_CATEGORIES.map((category) => (
                              <option key={category} value={category}>
                                {CATEGORY_DISPLAY_NAMES[category]}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Upload Media</label>
                          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-muted-foreground transition-colors">
                            <input
                              type="file"
                              multiple
                              accept="image/*,video/*"
                              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                              className="hidden"
                              id="media-upload"
                            />
                            <label htmlFor="media-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground mb-1">Click to upload images or videos</p>
                              <p className="text-muted-foreground text-sm">Support for multiple files</p>
                            </label>
                          </div>
                          {newProject.media.length > 0 && (
                            <SortableMediaGrid
                              media={newProject.media}
                              onReorder={(newMedia) => {
                                setNewProject((prev) => ({
                                  ...prev,
                                  media: newMedia,
                                }))
                              }}
                              onRemove={(id) => {
                                setNewProject((prev) => ({
                                  ...prev,
                                  media: prev.media.filter((m) => m.id !== id),
                                }))
                              }}
                              toPublicUrl={toPublicUrl}
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Vimeo Videos</label>
                          <Textarea
                            value={vimeoLinks}
                            onChange={(e) => setVimeoLinks(e.target.value)}
                            className="bg-muted border-border text-foreground min-h-[80px]"
                            placeholder="Enter Vimeo video URLs (one per line)&#10;Example:&#10;https://vimeo.com/123456789&#10;https://vimeo.com/987654321"
                          />
                          {vimeoLinks.trim() && (
                            <Button
                              type="button"
                              onClick={processVimeoLinks}
                              disabled={isProcessingVimeo}
                              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                            >
                              {isProcessingVimeo ? "Processing..." : "Add Vimeo Videos"}
                            </Button>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Visibility</label>
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              onClick={() => setNewProject({ ...newProject, visibility: !newProject.visibility })}
                              className={`px-4 py-2 rounded ${newProject.visibility
                                ? "bg-green-500 hover:bg-green-600 text-foreground"
                                : "bg-gray-600 hover:bg-gray-700 text-muted-foreground"
                                }`}
                            >
                              {newProject.visibility ? "Visible" : "Hidden"}
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {newProject.visibility
                                ? "Project will be visible to public"
                                : "Project will be hidden from public"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            onClick={handleAddProject}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Add Project
                          </Button>
                          <Button
                            onClick={() => {
                              if (hasFormData()) {
                                const confirmed = window.confirm(
                                  "Are you sure you want to cancel? All unsaved changes will be lost."
                                )
                                if (confirmed) {
                                  setNewProject({ title: "", description: "", category: DEFAULT_CATEGORY, thumbnail: "", visibility: true, media: [] })
                                  setVimeoLinks("")
                                  setIsProcessingVimeo(false)
                                  setIsAddDialogOpen(false)
                                }
                              } else {
                                setNewProject({ title: "", description: "", category: DEFAULT_CATEGORY, thumbnail: "", visibility: true, media: [] })
                                setVimeoLinks("")
                                setIsProcessingVimeo(false)
                                setIsAddDialogOpen(false)
                              }
                            }}
                            variant="outline"
                            className="flex-1 border-border text-muted-foreground hover:bg-muted"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <Card key={project.id} className="bg-card/50 border-gray-800">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2">
                            <Dialog open={isEditDialogOpen && editingProject?.id === project.id} onOpenChange={handleEditDialogClose}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingProject(project);
                                    setIsEditDialogOpen(true);
                                  }}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-card border-border text-foreground max-w-2xl max-h-[90vh] overflow-hidden">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-semibold">Edit Project</DialogTitle>
                                </DialogHeader>
                                {editingProject && editingProject.id === project.id && (
                                  <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-100px)] pr-2">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Title</label>
                                      <Input
                                        value={editingProject.title}
                                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                                        className="bg-muted border-border text-foreground"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Description</label>
                                      <Textarea
                                        value={editingProject.description}
                                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                                        className="bg-muted border-border text-foreground min-h-[100px]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Category</label>
                                      <select
                                        value={editingProject.category || DEFAULT_CATEGORY}
                                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as typeof DEFAULT_CATEGORY })}
                                        className="w-full bg-muted border border-border rounded px-3 py-2 text-foreground"
                                      >
                                        {PROJECT_CATEGORIES.map((category) => (
                                          <option key={category} value={category}>
                                            {CATEGORY_DISPLAY_NAMES[category]}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Edit Media</label>
                                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-muted-foreground transition-colors">
                                        <input
                                          type="file"
                                          multiple
                                          accept="image/*,video/*"
                                          onChange={(e) => e.target.files && handleFileUpload(e.target.files, true)}
                                          className="hidden"
                                          id="media-edit-upload"
                                        />
                                        <label htmlFor="media-edit-upload" className="cursor-pointer">
                                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                          <p className="text-muted-foreground mb-1">Click to upload images or videos</p>
                                          <p className="text-muted-foreground text-sm">Support for multiple files</p>
                                        </label>
                                      </div>
                                      {editingProject.media && editingProject.media.length > 0 && (
                                        <SortableMediaGrid
                                          media={editingProject.media}
                                          onReorder={(newMedia) => {
                                            setEditingProject((prev) => ({
                                              ...prev!,
                                              media: newMedia,
                                            }))
                                          }}
                                          onRemove={(id) => {
                                            setEditingProject((prev) => ({
                                              ...prev!,
                                              media: prev!.media.filter((m) => m.id !== id),
                                            }))
                                          }}
                                          toPublicUrl={toPublicUrl}
                                        />
                                      )}
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Vimeo Videos</label>
                                      <Textarea
                                        value={editVimeoLinks}
                                        onChange={(e) => setEditVimeoLinks(e.target.value)}
                                        className="bg-muted border-border text-foreground min-h-[80px]"
                                        placeholder="Enter Vimeo video URLs (one per line)&#10;Example:&#10;https://vimeo.com/123456789&#10;https://vimeo.com/987654321"
                                      />
                                      {editVimeoLinks.trim() && (
                                        <Button
                                          type="button"
                                          onClick={processEditVimeoLinks}
                                          disabled={isProcessingEditVimeo}
                                          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                                        >
                                          {isProcessingEditVimeo ? "Processing..." : "Add Vimeo Videos"}
                                        </Button>
                                      )}
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Visibility</label>
                                      <div className="flex items-center gap-3">
                                        <Button
                                          type="button"
                                          onClick={() => setEditingProject({ ...editingProject, visibility: !editingProject.visibility })}
                                          className={`px-4 py-2 rounded ${editingProject.visibility ? "bg-green-500 hover:bg-green-600 text-foreground" : "bg-gray-600 hover:bg-gray-700 text-muted-foreground"}`}
                                        >
                                          {editingProject.visibility ? "Visible" : "Hidden"}
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                          {editingProject.visibility ? "Project will be visible to public" : "Project will be hidden from public"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex gap-4">
                                      <Button
                                        onClick={handleEditProject}
                                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                      >
                                        Save Changes
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          const confirmed = window.confirm(
                                            "Are you sure you want to cancel? All unsaved changes will be lost."
                                          )
                                          if (confirmed) {
                                            setEditingProject(null);
                                            setEditVimeoLinks("");  // Reset Vimeo links
                                            setIsProcessingEditVimeo(false);  // Reset loading state
                                            setIsEditDialogOpen(false);
                                          }
                                        }}
                                        variant="outline"
                                        className="flex-1 border-border text-muted-foreground hover:bg-muted"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-muted-foreground hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-lg font-medium text-foreground">{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {formatDate(project)}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-12 h-12 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-medium text-muted-foreground mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-6">Start by adding your first project</p>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Project
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "home" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-light mb-2">Configure Home Page</h2>
                <p className="text-muted-foreground">Customize the main title or logo shown on the homepage</p>
              </div>
              <div className="bg-card/50 border border-gray-800 rounded-lg p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Display Type</label>
                      <select
                        value={homeContent.titleType}
                        onChange={(e) => setHomeContent({ ...homeContent, titleType: e.target.value as any })}
                        className="w-full bg-muted border border-border rounded px-3 py-2 text-sm"
                      >
                        <option value="text">Text Title</option>
                        <option value="logo">Logo Image</option>
                      </select>
                    </div>
                    {homeContent.titleType === 'text' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Title Text</label>
                        <Input
                          value={homeContent.titleText}
                          onChange={(e) => setHomeContent({ ...homeContent, titleText: e.target.value })}
                          className="bg-muted border-border text-foreground"
                          placeholder="PORTFOLIO"
                        />
                      </div>
                    )}
                  </div>

                  {homeContent.titleType === 'logo' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Logo Image</label>
                      {homeContent.logoUrl ? (
                        <div className="flex items-center gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={buildPublicMediaUrl(homeContent.logoUrl)} alt="Logo" className="h-16 w-auto object-contain border border-border rounded bg-muted p-2" />
                          <Button
                            type="button"
                            variant="outline"
                            className="border-border text-muted-foreground hover:bg-muted"
                            onClick={() => setHomeContent({ ...homeContent, logoUrl: '' })}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            id="home-logo-upload"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              try {
                                const path = await uploadMediaToStorage(file, 'logos')
                                setHomeContent({ ...homeContent, logoUrl: path })
                              } catch (err: any) {
                                alert('Error uploading logo: ' + (err?.message || err))
                              }
                            }}
                          />
                          <label htmlFor="home-logo-upload" className="block w-full border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground transition-colors text-sm text-muted-foreground">
                            Click to upload logo image
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <Input
                      value={homeContent.subtitle}
                      onChange={(e) => setHomeContent({ ...homeContent, subtitle: e.target.value })}
                      className="bg-muted border-border text-foreground"
                      placeholder="Subtitle below title or logo"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wide font-medium mb-1 text-muted-foreground">Title Font Size (px)</label>
                      <Input
                        type="number"
                        min={12}
                        max={160}
                        value={homeContent.typography?.title?.fontSize || ''}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          typography: {
                            ...homeContent.typography,
                            title: {
                              ...(homeContent.typography?.title || { fontFamily: 'Inter' }),
                              fontSize: Number(e.target.value)
                            },
                            subtitle: homeContent.typography?.subtitle || { fontFamily: 'Inter', fontSize: 22 }
                          }
                        })}
                        className="bg-muted border-border text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wide font-medium mb-1 text-muted-foreground">Subtitle Font Size (px)</label>
                      <Input
                        type="number"
                        min={10}
                        max={80}
                        value={homeContent.typography?.subtitle?.fontSize || ''}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          typography: {
                            ...homeContent.typography,
                            subtitle: {
                              ...(homeContent.typography?.subtitle || { fontFamily: 'Inter' }),
                              fontSize: Number(e.target.value)
                            },
                            title: homeContent.typography?.title || { fontFamily: 'Inter', fontSize: 64 }
                          }
                        })}
                        className="bg-muted border-border text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wide font-medium mb-1 text-muted-foreground">Title Font Family</label>
                      <select
                        className="w-full bg-muted border border-border rounded px-2 py-2 text-sm"
                        value={homeContent.typography?.title?.fontFamily || 'Inter'}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          typography: {
                            ...homeContent.typography,
                            title: { ...(homeContent.typography?.title || { fontSize: 64 }), fontFamily: e.target.value },
                            subtitle: homeContent.typography?.subtitle
                          }
                        })}
                      >
                        {AVAILABLE_FONTS.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wide font-medium mb-1 text-muted-foreground">Subtitle Font Family</label>
                      <select
                        className="w-full bg-muted border border-border rounded px-2 py-2 text-sm"
                        value={homeContent.typography?.subtitle?.fontFamily || 'Inter'}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          typography: {
                            ...homeContent.typography,
                            subtitle: { ...(homeContent.typography?.subtitle || { fontSize: 22 }), fontFamily: e.target.value },
                            title: homeContent.typography?.title
                          }
                        })}
                      >
                        {AVAILABLE_FONTS.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact Typography block moved to Contact tab */}

                  <div className="flex gap-4">
                    <Button onClick={handleSaveHome} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Settings className="w-4 h-4 mr-2" />
                      Save Home Content
                    </Button>
                    <Button
                      type="button"
                      variant={showHomePreview ? 'default' : 'outline'}
                      className="border-border text-muted-foreground hover:bg-muted"
                      onClick={() => setShowHomePreview(!showHomePreview)}
                    >
                      {showHomePreview ? 'Hide Preview' : 'Preview'}
                    </Button>
                    <Button
                      onClick={() => setHomeContent(defaultHomeContent)}
                      variant="outline"
                      className="border-border text-muted-foreground hover:bg-muted"
                    >
                      Reset to Default
                    </Button>
                  </div>
                  {showHomePreview && (
                    <div className="mt-8 border border-border rounded-lg p-8 bg-muted/30">
                      <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">Home Preview (Unsaved State)</h4>
                      <div className="text-center space-y-4">
                        {homeContent.titleType === 'logo' && homeContent.logoUrl ? (
                          <div className="flex justify-center mb-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={buildPublicMediaUrl(homeContent.logoUrl)}
                              alt={homeContent.titleText || 'Logo'}
                              className="h-20 w-auto object-contain"
                            />
                          </div>
                        ) : (
                          <h1
                            className="font-light tracking-wider"
                            style={{
                              fontFamily: fontFamilyMap[homeContent.typography?.title?.fontFamily] || 'inherit',
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
                              fontFamily: fontFamilyMap[homeContent.typography?.subtitle?.fontFamily] || 'inherit',
                              fontSize: (homeContent.typography?.subtitle?.fontSize || 22) + 'px'
                            }}
                          >
                            {homeContent.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-light mb-2">Configure About Page</h2>
                <p className="text-muted-foreground">Edit the information on your about page</p>
              </div>
              <div className="bg-card/50 border border-gray-800 rounded-lg p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Page Title</label>
                      <Input
                        value={aboutContent.title}
                        onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                        className="bg-muted border-border text-foreground"
                        placeholder="ABOUT"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name</label>
                      <Input
                        value={aboutContent.name}
                        onChange={(e) => setAboutContent({ ...aboutContent, name: e.target.value })}
                        className="bg-muted border-border text-foreground"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <Input
                      value={aboutContent.subtitle}
                      onChange={(e) => setAboutContent({ ...aboutContent, subtitle: e.target.value })}
                      className="bg-muted border-border text-foreground"
                      placeholder="Professional description"
                    />
                  </div>

                  {/* Profile Photo Upload Section */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Photo (Optional)</label>
                    <div className="space-y-4">
                      {aboutContent.photo && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={toPublicUrl(aboutContent.photo)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/placeholder-user.jpg";
                            }}
                          />
                          <Button
                            onClick={() => setAboutContent({ ...aboutContent, photo: "" })}
                            variant="outline"
                            size="sm"
                            className="absolute top-1 right-1 bg-red-600/80 border-red-600 text-white hover:bg-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}

                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-muted-foreground transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const uploadedUrl = await uploadMediaToStorage(file);
                                setAboutContent({ ...aboutContent, photo: uploadedUrl });
                              } catch (error) {
                                console.error('Error uploading photo:', error);
                                alert('Error uploading photo. Please try again.');
                              }
                            }
                          }}
                          className="hidden"
                          id="about-photo-upload"
                        />
                        <label htmlFor="about-photo-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground mb-1">
                            {aboutContent.photo ? "Change photo" : "Click to upload photo"}
                          </p>
                          <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">About Paragraphs</label>
                    {aboutContent.paragraphs?.map((paragraph, index) => (
                      <div key={index} className="mb-3 flex gap-3">
                        <Textarea
                          value={paragraph}
                          onChange={(e) => {
                            const newParagraphs = [...aboutContent.paragraphs];
                            newParagraphs[index] = e.target.value;
                            setAboutContent({ ...aboutContent, paragraphs: newParagraphs });
                          }}
                          className="bg-muted border-border text-foreground min-h-[100px]"
                          placeholder={`Paragraph ${index + 1}`}
                        />
                        <Button
                          onClick={() => {
                            const newParagraphs = aboutContent.paragraphs.filter((_, i) => i !== index);
                            setAboutContent({ ...aboutContent, paragraphs: newParagraphs });
                          }}
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-900/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        setAboutContent({
                          ...aboutContent,
                          paragraphs: [...(aboutContent.paragraphs || []), ""]
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:bg-muted"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Paragraph
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Learning Section Title</label>
                    <Input
                      value={aboutContent.learningsTitle}
                      onChange={(e) => setAboutContent({ ...aboutContent, learningsTitle: e.target.value })}
                      className="bg-muted border-border text-foreground"
                      placeholder="What I've learned:"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Learnings</label>
                    {aboutContent.learnings?.map((learning, index) => (
                      <div key={index} className="mb-3 flex gap-3">
                        <Input
                          value={learning}
                          onChange={(e) => {
                            const newLearnings = [...aboutContent.learnings];
                            newLearnings[index] = e.target.value;
                            setAboutContent({ ...aboutContent, learnings: newLearnings });
                          }}
                          className="bg-muted border-border text-foreground"
                          placeholder={`Learning ${index + 1}`}
                        />
                        <Button
                          onClick={() => {
                            const newLearnings = aboutContent.learnings.filter((_, i) => i !== index);
                            setAboutContent({ ...aboutContent, learnings: newLearnings });
                          }}
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-900/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        setAboutContent({
                          ...aboutContent,
                          learnings: [...(aboutContent.learnings || []), ""]
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:bg-muted"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Learning
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Closing Paragraphs</label>
                    {aboutContent.closingParagraphs?.map((paragraph, index) => (
                      <div key={index} className="mb-3 flex gap-3">
                        <Textarea
                          value={paragraph}
                          onChange={(e) => {
                            const newClosingParagraphs = [...aboutContent.closingParagraphs];
                            newClosingParagraphs[index] = e.target.value;
                            setAboutContent({ ...aboutContent, closingParagraphs: newClosingParagraphs });
                          }}
                          className="bg-muted border-border text-foreground"
                          placeholder={`Closing paragraph ${index + 1}`}
                        />
                        <Button
                          onClick={() => {
                            const newClosingParagraphs = aboutContent.closingParagraphs.filter((_, i) => i !== index);
                            setAboutContent({ ...aboutContent, closingParagraphs: newClosingParagraphs });
                          }}
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-900/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        setAboutContent({
                          ...aboutContent,
                          closingParagraphs: [...(aboutContent.closingParagraphs || []), ""]
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:bg-muted"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Closing Paragraph
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Final Message</label>
                    <Input
                      value={aboutContent.finalMessage}
                      onChange={(e) => setAboutContent({ ...aboutContent, finalMessage: e.target.value })}
                      className="bg-muted border-border text-foreground"
                      placeholder="Let's make it together."
                    />
                  </div>

                  <div className="border border-border rounded-lg p-4 space-y-4">
                    <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Typography</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs mb-1">Title Size</label>
                        <Input type="number" min={24} max={120}
                          value={aboutContent.typography?.title?.fontSize || ''}
                          onChange={(e) => setAboutContent({
                            ...aboutContent,
                            typography: {
                              ...aboutContent.typography,
                              title: { ...(aboutContent.typography?.title || { fontFamily: 'Inter' }), fontSize: Number(e.target.value) }
                            }
                          })}
                          className="bg-muted border-border text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Subtitle Size</label>
                        <Input type="number" min={12} max={80}
                          value={aboutContent.typography?.subtitle?.fontSize || ''}
                          onChange={(e) => setAboutContent({
                            ...aboutContent,
                            typography: {
                              ...aboutContent.typography,
                              subtitle: { ...(aboutContent.typography?.subtitle || { fontFamily: 'Inter' }), fontSize: Number(e.target.value) }
                            }
                          })}
                          className="bg-muted border-border text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Body Size</label>
                        <Input type="number" min={12} max={48}
                          value={aboutContent.typography?.body?.fontSize || ''}
                          onChange={(e) => setAboutContent({
                            ...aboutContent,
                            typography: {
                              ...aboutContent.typography,
                              body: { ...(aboutContent.typography?.body || { fontFamily: 'Inter' }), fontSize: Number(e.target.value) }
                            }
                          })}
                          className="bg-muted border-border text-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleSaveAbout}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Save About Content
                    </Button>
                    <Button
                      type="button"
                      variant={showAboutPreview ? 'default' : 'outline'}
                      className="border-border text-muted-foreground hover:bg-muted"
                      onClick={() => setShowAboutPreview(!showAboutPreview)}
                    >
                      {showAboutPreview ? 'Hide Preview' : 'Preview'}
                    </Button>
                    <Button
                      onClick={() => setAboutContent(defaultAboutContent)}
                      variant="outline"
                      className="border-border text-muted-foreground hover:bg-muted"
                    >
                      Reset to Default
                    </Button>
                  </div>
                  {showAboutPreview && (
                    <div className="mt-8 border border-border rounded-lg p-8 bg-muted/30 space-y-10">
                      <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">About Preview (Unsaved State)</h4>
                      <div className="text-center">
                        <h1
                          className="font-light tracking-wider mb-6"
                          style={{ fontFamily: fontFamilyMap[aboutContent.typography?.title?.fontFamily] || 'inherit', fontSize: (aboutContent.typography?.title?.fontSize || 56) + 'px' }}
                        >
                          {aboutContent.title}
                        </h1>
                        <p
                          className="text-muted-foreground max-w-2xl mx-auto"
                          style={{ fontFamily: fontFamilyMap[aboutContent.typography?.subtitle?.fontFamily] || 'inherit', fontSize: (aboutContent.typography?.subtitle?.fontSize || 20) + 'px' }}
                        >
                          {aboutContent.subtitle}
                        </p>
                      </div>
                      <div className="space-y-6 max-w-3xl mx-auto text-muted-foreground" style={{ fontFamily: fontFamilyMap[aboutContent.typography?.body?.fontFamily] || 'inherit', fontSize: (aboutContent.typography?.body?.fontSize || 18) + 'px' }}>
                        {aboutContent.paragraphs?.map((p, i) => (<p key={i}>{p}</p>))}
                        {aboutContent.learningsTitle && (
                          <div className="pt-2">
                            <h3
                              className="font-medium mb-3 text-foreground"
                              style={{ fontFamily: aboutContent.typography?.subheading?.fontFamily || 'inherit', fontSize: (aboutContent.typography?.subheading?.fontSize || 22) + 'px' }}
                            >
                              {aboutContent.learningsTitle}
                            </h3>
                            <ul className="space-y-2 list-disc list-inside">
                              {aboutContent.learnings?.map((l, i) => (<li key={i}>{l}</li>))}
                            </ul>
                          </div>
                        )}
                        {aboutContent.closingParagraphs?.map((p, i) => (<p key={i}>{p}</p>))}
                        {aboutContent.finalMessage && (
                          <p
                            className="font-medium text-foreground pt-4"
                            style={{ fontFamily: aboutContent.typography?.finalMessage?.fontFamily || 'inherit', fontSize: (aboutContent.typography?.finalMessage?.fontSize || 22) + 'px' }}
                          >
                            {aboutContent.finalMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-light mb-2">Configure Contact Page</h2>
                <p className="text-muted-foreground">Edit contact information and details</p>
              </div>
              <div className="bg-card/50 border border-gray-800 rounded-lg p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Page Title</label>
                      <Input
                        value={contactContent.title}
                        onChange={(e) => setContactContent({ ...contactContent, title: e.target.value })}
                        className="bg-muted border-border text-foreground"
                        placeholder="CONTACT"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Get in Touch Title</label>
                      <Input
                        value={contactContent.getInTouchTitle}
                        onChange={(e) => setContactContent({ ...contactContent, getInTouchTitle: e.target.value })}
                        className="bg-muted border-border text-foreground"
                        placeholder="Get in Touch"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <Input
                      value={contactContent.subtitle}
                      onChange={(e) => setContactContent({ ...contactContent, subtitle: e.target.value })}
                      className="bg-muted border-border text-foreground"
                      placeholder="Let's collaborate on your next creative project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Get in Touch Description</label>
                    <Textarea
                      value={contactContent.getInTouchDescription}
                      onChange={(e) => setContactContent({ ...contactContent, getInTouchDescription: e.target.value })}
                      className="bg-muted border-border text-foreground min-h-[100px]"
                      placeholder="Description for the get in touch section"
                    />
                  </div>
                  {/* Typography Controls */}
                  <div className="border border-border rounded-lg p-6 space-y-4">
                    <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Typography</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs mb-1">Title Size</label>
                        <Input type="number" min={24} max={120} value={contactContent.typography?.title?.fontSize || ''}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              title: { ...(contactContent.typography?.title || { fontFamily: 'Inter' }), fontSize: Number(e.target.value) }
                            }
                          })} className="bg-muted border-border text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Subtitle Size</label>
                        <Input type="number" min={12} max={80} value={contactContent.typography?.subtitle?.fontSize || ''}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              subtitle: { ...(contactContent.typography?.subtitle || { fontFamily: 'Inter' }), fontSize: Number(e.target.value) }
                            }
                          })} className="bg-muted border-border text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Section Title Size</label>
                        <Input type="number" min={16} max={72} value={contactContent.typography?.sectionTitle?.fontSize || ''}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              sectionTitle: { ...(contactContent.typography?.sectionTitle || { fontFamily: 'Inter' }), fontSize: Number(e.target.value) }
                            }
                          })} className="bg-muted border-border text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Section Body Size</label>
                        <Input type="number" min={12} max={48} value={contactContent.typography?.sectionBody?.fontSize || ''}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              sectionBody: { ...(contactContent.typography?.sectionBody || { fontFamily: 'Inter' }), fontSize: Number(e.target.value) }
                            }
                          })} className="bg-muted border-border text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Name Size</label>
                        <Input type="number" min={12} max={64} value={contactContent.typography?.name?.fontSize || ''}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              name: { ...(contactContent.typography?.name || { fontFamily: 'Inter' }), fontSize: Number(e.target.value) }
                            }
                          })} className="bg-muted border-border text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Small Text Size</label>
                        <Input type="number" min={10} max={40} value={contactContent.typography?.small?.fontSize || ''}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              small: { ...(contactContent.typography?.small || { fontFamily: 'Inter' }), fontSize: Number(e.target.value) }
                            }
                          })} className="bg-muted border-border text-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs mb-1">Title Font</label>
                        <select className="w-full bg-muted border border-border rounded px-2 py-1 text-sm"
                          value={contactContent.typography?.title?.fontFamily || 'Inter'}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              title: { ...(contactContent.typography?.title || { fontSize: 56 }), fontFamily: e.target.value }
                            }
                          })}
                        >{AVAILABLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Subtitle Font</label>
                        <select className="w-full bg-muted border border-border rounded px-2 py-1 text-sm"
                          value={contactContent.typography?.subtitle?.fontFamily || 'Inter'}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              subtitle: { ...(contactContent.typography?.subtitle || { fontSize: 20 }), fontFamily: e.target.value }
                            }
                          })}
                        >{AVAILABLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Section Title Font</label>
                        <select className="w-full bg-muted border border-border rounded px-2 py-1 text-sm"
                          value={contactContent.typography?.sectionTitle?.fontFamily || 'Inter'}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              sectionTitle: { ...(contactContent.typography?.sectionTitle || { fontSize: 28 }), fontFamily: e.target.value }
                            }
                          })}
                        >{AVAILABLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Section Body Font</label>
                        <select className="w-full bg-muted border border-border rounded px-2 py-1 text-sm"
                          value={contactContent.typography?.sectionBody?.fontFamily || 'Inter'}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              sectionBody: { ...(contactContent.typography?.sectionBody || { fontSize: 18 }), fontFamily: e.target.value }
                            }
                          })}
                        >{AVAILABLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Name Font</label>
                        <select className="w-full bg-muted border border-border rounded px-2 py-1 text-sm"
                          value={contactContent.typography?.name?.fontFamily || 'Inter'}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              name: { ...(contactContent.typography?.name || { fontSize: 24 }), fontFamily: e.target.value }
                            }
                          })}
                        >{AVAILABLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Small Font</label>
                        <select className="w-full bg-muted border border-border rounded px-2 py-1 text-sm"
                          value={contactContent.typography?.small?.fontFamily || 'Inter'}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            typography: {
                              ...contactContent.typography,
                              small: { ...(contactContent.typography?.small || { fontSize: 16 }), fontFamily: e.target.value }
                            }
                          })}
                        >{AVAILABLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 text-foreground">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          value={contactContent.personalInfo.name}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            personalInfo: { ...contactContent.personalInfo, name: e.target.value }
                          })}
                          className="bg-muted border-border text-foreground"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Position</label>
                        <Input
                          value={contactContent.personalInfo.position}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            personalInfo: { ...contactContent.personalInfo, position: e.target.value }
                          })}
                          className="bg-muted border-border text-foreground"
                          placeholder="Your job title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <Input
                          value={contactContent.personalInfo.company}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            personalInfo: { ...contactContent.personalInfo, company: e.target.value }
                          })}
                          className="bg-muted border-border text-foreground"
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          value={contactContent.personalInfo.email}
                          onChange={(e) => setContactContent({
                            ...contactContent,
                            personalInfo: { ...contactContent.personalInfo, email: e.target.value }
                          })}
                          className="bg-muted border-border text-foreground"
                          placeholder="your@email.com"
                          type="email"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleSaveContact}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Save Contact Information
                    </Button>
                    {/* Typography controls now live above buttons */}
                    <Button
                      type="button"
                      variant={showContactPreview ? 'default' : 'outline'}
                      className="border-border text-muted-foreground hover:bg-muted"
                      onClick={() => setShowContactPreview(!showContactPreview)}
                    >
                      {showContactPreview ? 'Hide Preview' : 'Preview'}
                    </Button>
                    <Button
                      onClick={() => setContactContent(defaultContactContent)}
                      variant="outline"
                      className="border-border text-muted-foreground hover:bg-muted"
                    >
                      Reset to Default
                    </Button>
                  </div>
                  {showContactPreview && (
                    <div className="mt-8 border border-border rounded-lg p-8 bg-muted/30 space-y-10">
                      <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Contact Preview (Unsaved State)</h4>
                      <div className="text-center">
                        <h1
                          className="font-light tracking-wider mb-6"
                          style={{ fontFamily: contactContent.typography?.title?.fontFamily || 'inherit', fontSize: (contactContent.typography?.title?.fontSize || 56) + 'px' }}
                        >
                          {contactContent.title}
                        </h1>
                        <p
                          className="text-muted-foreground max-w-2xl mx-auto"
                          style={{ fontFamily: contactContent.typography?.subtitle?.fontFamily || 'inherit', fontSize: (contactContent.typography?.subtitle?.fontSize || 20) + 'px' }}
                        >
                          {contactContent.subtitle}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <div className="space-y-6">
                          <h2
                            className="font-light"
                            style={{ fontFamily: contactContent.typography?.sectionTitle?.fontFamily || 'inherit', fontSize: (contactContent.typography?.sectionTitle?.fontSize || 28) + 'px' }}
                          >
                            {contactContent.getInTouchTitle}
                          </h2>
                          <p
                            className="text-muted-foreground leading-relaxed"
                            style={{ fontFamily: contactContent.typography?.sectionBody?.fontFamily || 'inherit', fontSize: (contactContent.typography?.sectionBody?.fontSize || 18) + 'px' }}
                          >
                            {contactContent.getInTouchDescription}
                          </p>
                          <div>
                            <h3
                              className="font-light text-foreground mb-1"
                              style={{ fontFamily: contactContent.typography?.name?.fontFamily || 'inherit', fontSize: (contactContent.typography?.name?.fontSize || 24) + 'px' }}
                            >
                              {contactContent.personalInfo.name}
                            </h3>
                            <p className="text-muted-foreground" style={{ fontFamily: contactContent.typography?.small?.fontFamily || 'inherit', fontSize: (contactContent.typography?.small?.fontSize || 16) + 'px' }}>{contactContent.personalInfo.position}</p>
                            <p className="text-muted-foreground" style={{ fontFamily: contactContent.typography?.small?.fontFamily || 'inherit', fontSize: (contactContent.typography?.small?.fontSize || 16) + 'px' }}>{contactContent.personalInfo.company}</p>
                            <p className="text-muted-foreground mt-2" style={{ fontFamily: contactContent.typography?.small?.fontFamily || 'inherit', fontSize: (contactContent.typography?.small?.fontSize || 16) + 'px' }}>{contactContent.personalInfo.email}</p>
                          </div>
                        </div>
                        <div className="border border-dashed border-border rounded-lg p-6 text-muted-foreground text-sm flex items-center justify-center">
                          Form preview omitted (uses live site styles). Save & view on site.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`fixed right-0 top-0 ${rightSidebarOpen ? 'w-80' : 'w-16'} h-screen bg-card border-l border-gray-800 flex flex-col z-10 transition-all duration-300`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800 flex-shrink-0">

          {/* Navigation Tabs */}
          {rightSidebarOpen && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</span>
              <div className="flex flex-col gap-1">
                <Button
                  variant={activeTab === "home" ? "default" : "ghost"}
                  className="justify-start h-10"
                  onClick={() => setActiveTab("home")}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <Button
                  variant={activeTab === "projects" ? "default" : "ghost"}
                  className="justify-start h-10"
                  onClick={() => setActiveTab("projects")}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Projects
                </Button>
                <Button
                  variant={activeTab === "about" ? "default" : "ghost"}
                  className="justify-start h-10"
                  onClick={() => setActiveTab("about")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  About
                </Button>
                <Button
                  variant={activeTab === "contact" ? "default" : "ghost"}
                  className="justify-start h-10"
                  onClick={() => setActiveTab("contact")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {rightSidebarOpen ? (
            <>
              {/* Statistics */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statistics</span>
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Projects</p>
                      <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                    </div>
                    <FolderOpen className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Public Projects</p>
                      <p className="text-2xl font-bold text-green-500">{projects.filter(p => p.visibility).length}</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Projects List - Only show when on projects tab */}
              {activeTab === "projects" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Projects</span>
                    <Badge className="bg-blue-600 text-foreground text-xs px-2 py-1">{projects.length}</Badge>
                  </div>
                  {projects.slice(0, 8).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg group transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground truncate font-medium">{project.title}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-gray-700 text-muted-foreground text-xs px-2 py-0">{project.category.toLowerCase()}</Badge>
                          {project.visibility && <Badge className="bg-green-500 text-foreground text-xs px-2 py-0">public</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            try {
                              await apiUpdateProject(project.id, { visibility: !project.visibility });
                              try { router.refresh() } catch { }
                              const data = await apiGetProjects();
                              setProjects(data || []);
                            } catch (err: any) {
                              alert("Error updating visibility: " + (err?.message || err));
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        >
                          {project.visibility ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  ))}

                  {projects.length > 8 && (
                    <div className="text-center pt-2">
                      <span className="text-xs text-muted-foreground">and {projects.length - 8} more projects...</span>
                    </div>
                  )}
                </div>
              )}

              {/* About Content Preview */}
              {activeTab === "about" && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">About Preview</span>
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    {aboutContent && (aboutContent.title || aboutContent.name) ? (
                      <div className="text-sm text-muted-foreground">
                        <h4 className="font-semibold text-foreground mb-2">{aboutContent.title}</h4>
                        <p className="text-muted-foreground mb-2">{aboutContent.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-3">{aboutContent.subtitle}</p>
                        <Badge className="bg-green-600 text-foreground text-xs px-2 py-1 mt-2">Content Added</Badge>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No about content yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Content Preview */}
              {activeTab === "contact" && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Preview</span>
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    {contactContent && (contactContent.title || contactContent.personalInfo?.name) ? (
                      <div className="text-sm text-muted-foreground">
                        <h4 className="font-semibold text-foreground mb-2">{contactContent.title}</h4>
                        <p className="text-muted-foreground mb-1">{contactContent.personalInfo?.name}</p>
                        <p className="text-xs text-muted-foreground mb-1">{contactContent.personalInfo?.position}</p>
                        <p className="text-xs text-muted-foreground">{contactContent.personalInfo?.email}</p>
                        <Badge className="bg-green-600 text-foreground text-xs px-2 py-1 mt-2">Content Added</Badge>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Settings className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No contact content yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-foreground text-xs font-bold">{projects.length}</span>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-foreground text-xs font-bold">{projects.filter(p => p.visibility).length}</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setActiveTab("projects")}
                className={`w-8 h-8 ${activeTab === "projects" ? "bg-blue-600" : "hover:bg-muted"}`}
              >
                <FolderOpen className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setActiveTab("about")}
                className={`w-8 h-8 ${activeTab === "about" ? "bg-blue-600" : "hover:bg-muted"}`}
              >
                <Users className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setActiveTab("contact")}
                className={`w-8 h-8 ${activeTab === "contact" ? "bg-blue-600" : "hover:bg-muted"}`}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
