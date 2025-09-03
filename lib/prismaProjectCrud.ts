// Prisma Project CRUD
import prisma from './prisma'

export interface Project {
  id?: string;
  title: string;
  description: string;
  category?: string;
  thumbnail?: string;
  visibility?: boolean;
  media?: any;
  created_at?: string;
}

export async function addProject(project: Project): Promise<Project> {
  const created = await prisma.project.create({ data: {
    title: project.title,
    description: project.description,
    category: project.category,
    thumbnail: project.thumbnail,
    visibility: project.visibility ?? true,
    media: JSON.stringify(project.media || [])
  }})
  return created as unknown as Project
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const updated = await prisma.project.update({ where: { id }, data: {
    title: updates.title,
    description: updates.description,
    category: updates.category,
    thumbnail: updates.thumbnail,
    visibility: updates.visibility,
    media: updates.media ? JSON.stringify(updates.media) : undefined
  }})
  return updated as unknown as Project
}

export async function deleteProject(id: string): Promise<boolean> {
  await prisma.project.delete({ where: { id } })
  return true
}
