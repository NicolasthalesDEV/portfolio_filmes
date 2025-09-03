import { NextRequest, NextResponse } from 'next/server'

// Senhas do site - em produção, use variáveis de ambiente
const SITE_PASSWORD = process.env.SITE_PASSWORD || "Paris2025!"
const TEMP_PASSWORD = process.env.TEMP_PASSWORD || "Visit2025!"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      )
    }

    let userType = ""
    let isValid = false

    if (password === SITE_PASSWORD) {
      userType = "admin"
      isValid = true
    } else if (password === TEMP_PASSWORD) {
      userType = "temp"
      isValid = true
    }

    if (isValid) {
      // Senha correta
      const response = NextResponse.json(
        { success: true, message: "Access authorized", userType },
        { status: 200 }
      )

      // Define cookies de autenticação
      response.cookies.set('site-authenticated', 'true', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400, // 24 horas
        path: '/'
      })

      response.cookies.set('user-type', userType, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400, // 24 horas
        path: '/'
      })

      return response
    } else {
      // Senha incorreta
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
