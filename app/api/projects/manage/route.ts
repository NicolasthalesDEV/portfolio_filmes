import { NextRequest, NextResponse } from "next/server"
import { addProject, updateProject, deleteProject } from "@/lib/prismaProjectCrud"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await addProject(body)
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    })
  } catch (error) {
    console.error('Erro ao criar projeto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }
    
    const result = await updateProject(id, data)
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    })
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }
    
    await deleteProject(id)
    
    return NextResponse.json({ 
      success: true 
    })
  } catch (error) {
    console.error('Erro ao deletar projeto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
