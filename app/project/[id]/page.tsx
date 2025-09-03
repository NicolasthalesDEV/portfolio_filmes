import ProjectDetail from "@/components/project-detail"
import PageTemplate from "@/components/page-template"

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  return (
    <PageTemplate>
      <ProjectDetail projectId={id} />
    </PageTemplate>
  )
}
