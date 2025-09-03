import { NextRequest, NextResponse } from "next/server"
import { getPageContent } from "@/lib/contentApi"

export async function GET(request: NextRequest) {
  try {
    console.log('API Content - Início da requisição')
    
    const { searchParams } = new URL(request.url)
    const pageType = searchParams.get('type')
    
    console.log('API Content - Page type:', pageType)
    
    if (!pageType) {
      console.log('API Content - Erro: Page type não fornecido')
      return NextResponse.json({ error: 'Page type is required' }, { status: 400 })
    }

    console.log('API Content - Chamando getPageContent...')
    const content = await getPageContent(pageType as any)
    console.log('API Content - Conteúdo obtido:', content ? 'Sucesso' : 'Vazio')
    
    return NextResponse.json(content)
  } catch (error) {
    console.error('API Content - Erro completo:', error)
    console.error('API Content - Stack trace:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: String(error) },
      { status: 500 }
    )
  }
}
