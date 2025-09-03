import { NextRequest, NextResponse } from "next/server"
import { loginAdmin } from "@/lib/prismaAdminApi"

export async function POST(request: NextRequest) {
  try {
    console.log('=== LOGIN API CHAMADA ===')
    const body = await request.json()
    console.log('Body recebido:', body)
    const { email, password } = body

    if (!email || !password) {
      console.log('Erro: Email ou senha faltando')
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('Tentando login com:', { email, password: '***' })
    const user = await loginAdmin({ email, password })
    console.log('Login bem-sucedido:', { id: user.id, email: user.email })
    
    return NextResponse.json({ 
      success: true, 
      user: user 
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
