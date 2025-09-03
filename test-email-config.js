const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testEmailDestination() {
  try {
    console.log('🔍 Verificando configuração de email...')

    // Buscar conteúdo da página de contato
    const contactContent = await prisma.pageContent.findUnique({
      where: { page_type: 'contact' }
    })

    if (!contactContent) {
      console.log('❌ Página de contato não encontrada')
      return
    }

    const content = JSON.parse(contactContent.content)

    console.log('📧 Email de destino configurado:', content.emailDestination)
    console.log('📧 Email das informações pessoais:', content.personalInfo?.email)

    if (content.emailDestination) {
      console.log('✅ Campo emailDestination configurado corretamente!')
    } else {
      console.log('⚠️ Campo emailDestination não encontrado')
    }

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testEmailDestination()
