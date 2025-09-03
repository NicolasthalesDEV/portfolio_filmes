// Unified data API (renamed from supabaseApi) backed by Prisma
import prisma from './prisma'

export async function getProjects(onlyVisible: boolean = true) {
  const where: any = {}
  if (onlyVisible) {
    where.visibility = true
  }
  const projects = await prisma.project.findMany({ where, orderBy: { created_at: 'desc' } })
  
  // Parse JSON strings back to objects for SQLite compatibility
  return projects.map(project => ({
    ...project,
    media: project.media ? JSON.parse(project.media as string) : null
  }))
}

export async function getProjectSkills(projectId: string) {
  const rows = await prisma.projectSkill.findMany({
    where: { projectId },
    include: { skill: { select: { name: true, icon_url: true, id: true } } }
  })
  return rows.map((r: { skillId: string; skill: { name: string; icon_url: string | null } }) => ({
    skill_id: r.skillId,
    skills: { name: r.skill.name, icon_url: r.skill.icon_url }
  }))
}

export async function getSkills() {
  return prisma.skill.findMany({ orderBy: { name: 'asc' } })
}

export async function sendContact({ name, email, message, subject }: { name: string; email: string; message: string; subject?: string }) {
  await prisma.contact.create({ data: { name, email, message } })
  try {
    const response = await fetch('/api/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, subject: subject || 'Portfolio Contact', message }) })
    if (!response.ok) console.warn('Email sending failed')
  } catch (e) { console.warn('Email sending failed', e) }
  return true
}
