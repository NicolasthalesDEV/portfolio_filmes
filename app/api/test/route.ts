import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'API funcionando',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro na API de teste:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: String(error) },
      { status: 500 }
    )
  }
}
