import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  console.log("Email API called")
  try {
    const body = await req.json()
    const { name, email, subject, message } = body
    console.log("Received data:", { name, email, subject, message: message?.slice(0, 50) + "..." })

    // Validate required fields
    if (!name || !email || !message) {
      console.log("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email configuration is available and valid
    const emailConfig = {
      hasHost: !!process.env.EMAIL_HOST,
      hasUser: !!process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS,
      host: process.env.EMAIL_HOST,
      user: process.env.EMAIL_USER,
      port: process.env.EMAIL_PORT,
    }
    console.log("Email configuration:", emailConfig)
    
    const isEmailConfigured = process.env.EMAIL_HOST && 
                              process.env.EMAIL_USER && 
                              process.env.EMAIL_PASS && 
                              process.env.EMAIL_USER !== 'your-email@gmail.com' &&
                              process.env.EMAIL_PASS !== 'your-app-password'
    
    if (!isEmailConfigured) {
      console.log("Email not properly configured, returning success without sending email")
      return NextResponse.json({ 
        success: true, 
        message: "Form submitted successfully. Email sending is not configured." 
      }, { status: 200 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || "malobi@gmail.com",
      subject: `Portfolio Contact: ${subject || 'No Subject'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Sent from Malobi Dasgupta Portfolio Website</small></p>
      `,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ 
      error: "Failed to send email", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
