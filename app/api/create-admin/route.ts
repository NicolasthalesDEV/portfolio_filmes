import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('=== CRIANDO ADMIN ===')
    
    // Criar usuário admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@portfolio.com' },
      update: {},
      create: {
        email: 'admin@portfolio.com',
        password: 'Admin123!',
      },
    })
    
    console.log('👤 Admin created:', admin.email)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin criado com sucesso',
      admin: { email: admin.email, id: admin.id }
    })
  } catch (error) {
    console.error('Erro ao criar admin:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno' 
    }, { status: 500 })
  }
}
