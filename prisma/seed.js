const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function executarSeedCompleto() {
  console.log('🌱 INICIANDO SEED COMPLETO DO PORTFOLIO')
  console.log('')
  
  try {
    // LIMPEZA
    console.log('🧹 Limpando banco...')
    await prisma.projectSkill.deleteMany()
    await prisma.project.deleteMany()
    await prisma.skill.deleteMany()
    await prisma.pageContent.deleteMany()
    await prisma.user.deleteMany()
    console.log('✓ Banco limpo')
    console.log('')
    
    // USUÁRIO ADMIN
    console.log('👤 Criando admin...')
    const admin = await prisma.user.create({
      data: {
        email: 'admin@portfolio.com',
        password: 'Admin123!',
        name: 'Administrator',
        user_type: 'admin',
        is_active: true
      }
    })
    console.log(`✓ Admin: ${admin.email}`)
    console.log('')
    
    // SKILLS
    console.log('🛠️ Criando skills...')
    const skills = await Promise.all([
      prisma.skill.create({ data: { name: 'UI Design', icon_url: null } }),
      prisma.skill.create({ data: { name: 'Branding', icon_url: null } }),
      prisma.skill.create({ data: { name: 'Development', icon_url: null } }),
      prisma.skill.create({ data: { name: 'Photography', icon_url: null } }),
      prisma.skill.create({ data: { name: 'Illustration', icon_url: null } }),
      prisma.skill.create({ data: { name: 'Architecture', icon_url: null } }),
      prisma.skill.create({ data: { name: 'Fine Art', icon_url: null } }),
      prisma.skill.create({ data: { name: 'Advertising', icon_url: null } })
    ])
    console.log(`✓ ${skills.length} skills criadas`)
    console.log('')
    
    // PROJETOS
    console.log('🎬 Criando projetos...')
    
    const projetos = [
      {
        title: 'Sunset Dreams',
        description: 'Um curta-metragem experimental explorando temas de memória e nostalgia através de cinematografia onírica.',
        category: 'Film project',
        thumbnail: '/placeholder.svg?height=400&width=400&text=SUNSET+DREAMS',
        skillIds: [skills[3].id, skills[1].id] // Photography, Branding
      },
      {
        title: 'Urban Stories',
        description: 'Documentário sobre a vida urbana contemporânea, capturando histórias reais de pessoas nas grandes cidades.',
        category: 'Film project',
        thumbnail: '/placeholder.svg?height=400&width=400&text=URBAN+STORIES',
        skillIds: [skills[3].id] // Photography
      },
      {
        title: 'Brand Identity Studio',
        description: 'Identidade visual completa com logo, tipografia, paleta de cores e manual de aplicação da marca.',
        category: 'Graphic Design Project',
        thumbnail: '/placeholder.svg?height=400&width=400&text=BRAND+IDENTITY',
        skillIds: [skills[1].id, skills[0].id] // Branding, UI Design
      },
      {
        title: 'Magazine Layout',
        description: 'Design editorial para revista de lifestyle, incluindo capa, diagramação e elementos gráficos.',
        category: 'Graphic Design Project',
        thumbnail: '/placeholder.svg?height=400&width=400&text=MAGAZINE+LAYOUT',
        skillIds: [skills[1].id, skills[0].id] // Branding, UI Design
      },
      {
        title: 'Character Illustrations',
        description: 'Série de ilustrações digitais criando um universo visual único com personagens expressivos.',
        category: 'Illustration project',
        thumbnail: '/placeholder.svg?height=400&width=400&text=CHARACTER+ART',
        skillIds: [skills[4].id, skills[0].id] // Illustration, UI Design
      },
      {
        title: 'Modern Villa',
        description: 'Projeto arquitetônico residencial combinando modernidade com sustentabilidade.',
        category: 'Architecture Project',
        thumbnail: '/placeholder.svg?height=400&width=400&text=MODERN+VILLA',
        skillIds: [skills[5].id] // Architecture
      },
      {
        title: 'Urban Expressions',
        description: 'Série de pinturas explorando a vida urbana através de técnicas mistas.',
        category: 'Small fine art project',
        thumbnail: '/placeholder.svg?height=400&width=400&text=URBAN+ART',
        skillIds: [skills[6].id] // Fine Art
      },
      {
        title: 'Campaign Launch',
        description: 'Campanha publicitária integrada para lançamento de produto inovador.',
        category: 'Advertising project',
        thumbnail: '/placeholder.svg?height=400&width=400&text=AD+CAMPAIGN',
        skillIds: [skills[7].id, skills[1].id] // Advertising, Branding
      }
    ]
    
    for (let i = 0; i < projetos.length; i++) {
      const projeto = projetos[i]
      await prisma.project.create({
        data: {
          title: projeto.title,
          description: projeto.description,
          category: projeto.category,
          thumbnail: projeto.thumbnail,
          visibility: true,
          media: JSON.stringify([
            { id: `${i+1}`, url: `/placeholder.svg?height=600&width=800&text=Media+${i+1}`, type: 'image', name: `Media ${i+1}` }
          ]),
          projectSkills: {
            create: projeto.skillIds.map(skillId => ({ skillId }))
          }
        }
      })
      console.log(`  ✓ ${projeto.title}`)
    }
    console.log('')
    
    // CONTEÚDO DAS PÁGINAS
    console.log('📄 Configurando páginas...')
    
    await prisma.pageContent.create({
      data: {
        page_type: 'home',
        content: JSON.stringify({
          title: "Creative Designer Portfolio",
          subtitle: "Transforming ideas into compelling visual experiences",
          typography: {
            title: { fontFamily: 'Playfair Display', fontSize: 64 },
            subtitle: { fontFamily: 'Inter', fontSize: 22 }
          }
        })
      }
    })
    
    await prisma.pageContent.create({
      data: {
        page_type: 'about',
        content: JSON.stringify({
          title: "ABOUT",
          subtitle: "Creative professional specializing in innovative design solutions",
          name: "Creative Designer",
          photo: "",
          paragraphs: [
            "Passionate about creating meaningful digital experiences that connect with users and solve real problems through thoughtful design.",
            "With expertise spanning UI/UX design, branding, and development, I transform complex ideas into compelling visual solutions."
          ],
          typography: {
            title: { fontFamily: 'Montserrat', fontSize: 56 },
            subtitle: { fontFamily: 'Lora', fontSize: 20 },
            body: { fontFamily: 'Inter', fontSize: 18 }
          }
        })
      }
    })
    
    await prisma.pageContent.create({
      data: {
        page_type: 'contact',
        content: JSON.stringify({
          title: "LET'S CONNECT",
          subtitle: "Ready to bring your vision to life? I'd love to hear about your project.",
          email: "hello@portfolio.com",
          phone: "+1 (555) 123-4567",
          typography: {
            title: { fontFamily: 'Oswald', fontSize: 48 },
            subtitle: { fontFamily: 'Inter', fontSize: 18 }
          }
        })
      }
    })
    console.log('✓ 3 páginas configuradas')
    console.log('')
    
    // VERIFICAÇÃO FINAL
    const totals = await Promise.all([
      prisma.user.count(),
      prisma.skill.count(),
      prisma.project.count(),
      prisma.pageContent.count()
    ])
    
    console.log('✅ SEED COMPLETADO COM SUCESSO!')
    console.log('')
    console.log('📊 RESUMO FINAL:')
    console.log(`  👤 Usuários: ${totals[0]}`)
    console.log(`  🛠️ Skills: ${totals[1]}`)
    console.log(`  🎬 Projetos: ${totals[2]}`)
    console.log(`  📄 Páginas: ${totals[3]}`)
    console.log('')
    console.log('🔑 LOGIN:')
    console.log('  Email: admin@portfolio.com')
    console.log('  Senha: Admin123!')
    console.log('')
    console.log('🎯 CATEGORIAS:')
    console.log('  • Film project')
    console.log('  • Graphic Design Project') 
    console.log('  • Illustration project')
    console.log('  • Architecture Project')
    console.log('  • Small fine art project')
    console.log('  • Advertising project')
    
  } catch (error) {
    console.error('❌ ERRO NO SEED:', error)
    throw error
  } finally {
    await prisma.$disconnect()
    console.log('')
    console.log('🔌 Conexão encerrada')
  }
}

executarSeedCompleto()
