import { NextRequest, NextResponse } from "next/server"
import { sendContact } from "@/lib/prismaDataApi"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validação básica
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const result = await sendContact({ name, email, subject, message })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso!',
      data: result 
    })
  } catch (error) {
    console.error('Erro ao enviar contato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
