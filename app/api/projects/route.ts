import { NextRequest, NextResponse } from "next/server"
import { getProjects } from "@/lib/prismaDataApi"

export async function GET() {
  try {
    const projects = await getProjects()
    
    return NextResponse.json({ 
      success: true, 
      data: projects 
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
