const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedRapido() {
  console.log('🌱 TESTE DE SEED SIMPLES')

  // Limpar dados
  await prisma.projectSkill.deleteMany()
  await prisma.project.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.user.deleteMany()
  console.log('✓ Dados limpos')

  // Criar admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@portfolio.com',
      password: 'Admin123!',
      name: 'Administrator',
      user_type: 'admin',
      is_active: true
    }
  })
  console.log('✓ Admin criado:', admin.email)

  // Criar skills
  const skill1 = await prisma.skill.create({
    data: { name: 'UI Design', icon_url: null }
  })

  const skill2 = await prisma.skill.create({
    data: { name: 'Photography', icon_url: null }
  })
  console.log('✓ Skills criadas:', skill1.name, skill2.name)

  // Criar projeto
  const projeto = await prisma.project.create({
    data: {
      title: 'Teste Project',
      description: 'Projeto de teste',
      category: 'Film project',
      thumbnail: '/placeholder.svg',
      visibility: true,
      temp_visible: false,
      media: JSON.stringify([
        { id: '1', url: '/test.jpg', type: 'image', name: 'Teste' }
      ]),
      projectSkills: {
        create: [
          { skillId: skill1.id }
        ]
      }
    }
  })
  console.log('✓ Projeto criado:', projeto.title)

  // Verificar totais
  const totalProjetos = await prisma.project.count()
  const totalSkills = await prisma.skill.count()
  const totalUsers = await prisma.user.count()

  console.log('')
  console.log('📊 TOTAIS:')
  console.log(`  Projetos: ${totalProjetos}`)
  console.log(`  Skills: ${totalSkills}`)
  console.log(`  Usuários: ${totalUsers}`)

  await prisma.$disconnect()
  console.log('✅ Teste concluído!')
}

seedRapido().catch(console.error)
