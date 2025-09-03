import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log('API Debug - Iniciando teste de Prisma')
    
    // Primeiro, testar se conseguimos importar o Prisma
    const { PrismaClient } = await import('@prisma/client')
    console.log('API Debug - PrismaClient importado com sucesso')
    
    // Testar se conseguimos criar uma instância
    const prisma = new PrismaClient()
    console.log('API Debug - Instância do Prisma criada')
    
    // Testar uma query simples
    const count = await prisma.project.count()
    console.log('API Debug - Query executada, count:', count)
    
    // Fechar conexão
    await prisma.$disconnect()
    console.log('API Debug - Conexão fechada')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prisma funcionando',
      projectCount: count
    })
  } catch (error) {
    console.error('API Debug - Erro completo:', error)
    console.error('API Debug - Stack trace:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { error: 'Erro no Prisma', details: String(error) },
      { status: 500 }
    )
  }
}
