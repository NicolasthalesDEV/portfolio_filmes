import prisma from './prisma'

export interface PageContentRecord {
  id?: string
  page_type: 'about' | 'contact' | 'home'
  content: any
  updated_at?: Date | string
}

export async function getPageContent(pageType: 'about' | 'contact' | 'home'): Promise<PageContentRecord | null> {
  const record = await prisma.pageContent.findUnique({ where: { page_type: pageType } })
  if (!record) return null
  return {
    ...record,
    content: typeof record.content === 'string' ? JSON.parse(record.content) : record.content
  } as PageContentRecord
}

export async function savePageContent(pageType: 'about' | 'contact' | 'home', content: any): Promise<PageContentRecord> {
  const contentString = typeof content === 'string' ? content : JSON.stringify(content)
  const upserted = await prisma.pageContent.upsert({
    where: { page_type: pageType },
    update: { content: contentString },
    create: { page_type: pageType, content: contentString }
  })
  return upserted as PageContentRecord
}

// Defaults (copied from previous supabaseContentApi)
export const defaultAboutContent = {
  title: "ABOUT",
  subtitle: "Creative professional specializing in innovative design solutions and visual storytelling",
  name: "Creative Designer",
  photo: "",
  paragraphs: [
    "Passionate about creating meaningful digital experiences that connect with users and solve real problems through thoughtful design.",
    "With expertise spanning UI/UX design, branding, and front-end development, I transform complex ideas into compelling visual solutions that resonate with audiences.",
    "My approach combines strategic thinking with creative execution, ensuring every project delivers both aesthetic appeal and functional excellence.",
    "Throughout my career, I've had the privilege of working on diverse projects ranging from brand identities to digital platforms, each teaching valuable lessons about the power of good design."
  ],
  learningsTitle: "What I've learned:",
  learnings: [
    "Great design starts with understanding the user's needs.",
    "The best solutions emerge from collaboration and iteration.",
    "Simplicity often requires the most complex thinking.",
    "Every constraint is an opportunity for creative problem-solving."
  ],
  closingParagraphs: [
    "I believe in the power of design to make a positive impact.",
    "The most rewarding projects are those that challenge conventional thinking."
  ],
  finalMessage: "Let's create something amazing together.",
  typography: {
    title: { fontFamily: 'Inter', fontSize: 56 },
    subtitle: { fontFamily: 'Inter', fontSize: 20 },
    name: { fontFamily: 'Inter', fontSize: 32 },
    subheading: { fontFamily: 'Inter', fontSize: 22 },
    body: { fontFamily: 'Inter', fontSize: 18 },
    finalMessage: { fontFamily: 'Inter', fontSize: 22 }
  }
}

export const defaultContactContent = {
  title: "CONTACT",
  subtitle: "Let's collaborate on your next creative project",
  getInTouchTitle: "Get in Touch",
  getInTouchDescription: "Always interested in new opportunities and creative challenges. Whether you have a project in mind or just want to connect, I'd love to hear from you.",
  personalInfo: {
    name: "Portfolio Designer",
    position: "Creative Professional",
    company: "Available for Projects",
    email: "contact@portfolio.com"
  },
  emailDestination: "contact@portfolio.com", // Email where form submissions will be sent
  typography: {
    title: { fontFamily: 'Inter', fontSize: 56 },
    subtitle: { fontFamily: 'Inter', fontSize: 20 },
    sectionTitle: { fontFamily: 'Inter', fontSize: 28 },
    sectionBody: { fontFamily: 'Inter', fontSize: 18 },
    name: { fontFamily: 'Inter', fontSize: 24 },
    small: { fontFamily: 'Inter', fontSize: 16 }
  }
}

export const defaultHomeContent = {
  titleType: 'text' as 'text' | 'logo',
  titleText: 'PORTFOLIO',
  subtitle: 'A collection of creative projects spanning advertising, design, and digital innovation',
  logoUrl: '',
  typography: {
    title: { fontFamily: 'Inter', fontSize: 64 },
    subtitle: { fontFamily: 'Inter', fontSize: 22 }
  }
}
