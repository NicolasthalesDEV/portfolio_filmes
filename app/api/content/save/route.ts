import { NextRequest, NextResponse } from "next/server"
import { savePageContent } from "@/lib/contentApi"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageType, content } = body

    if (!pageType || !content) {
      return NextResponse.json(
        { error: 'Page type and content are required' },
        { status: 400 }
      )
    }

    const result = await savePageContent(pageType, content)
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    })
  } catch (error) {
    console.error('Erro ao salvar conteúdo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
