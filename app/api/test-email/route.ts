import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    email_config: {
      hasHost: !!process.env.EMAIL_HOST,
      hasUser: !!process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS,
      hasTo: !!process.env.EMAIL_TO,
      host: process.env.EMAIL_HOST,
      user: process.env.EMAIL_USER,
      port: process.env.EMAIL_PORT,
      to: process.env.EMAIL_TO,
    }
  })
}
