const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verificarBanco() {
  try {
    const projetos = await prisma.project.count()
    const skills = await prisma.skill.count()
    const usuarios = await prisma.user.count()
    const paginas = await prisma.pageContent.count()

    console.log('📊 STATUS DO BANCO:')
    console.log(`  Projetos: ${projetos}`)
    console.log(`  Skills: ${skills}`)
    console.log(`  Usuários: ${usuarios}`)
    console.log(`  Páginas: ${paginas}`)

    if (projetos === 0) {
      console.log('\n❌ Nenhum projeto encontrado, executando seed...')

      // Executar o seed completo aqui
      const { execSync } = require('child_process')
      execSync('node prisma/seed.js', { stdio: 'inherit' })
    }

  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verificarBanco()
