import type React from "react"
import type { Metadata } from "next"
import {
  Inter,
  Playfair_Display,
  Lora,
  Roboto,
  Montserrat,
  Open_Sans,
  Poppins,
  Oswald,
  Raleway,
  Ubuntu
} from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
})

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
})

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
})

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
})

const ubuntu = Ubuntu({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
})

export const metadata: Metadata = {
  title: "Portfólio - Designer Criativo",
  description: "Portfólio profissional showcasing creative projects",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontVariables = [
    inter.variable,
    playfair.variable,
    lora.variable,
    roboto.variable,
    montserrat.variable,
    openSans.variable,
    poppins.variable,
    oswald.variable,
    raleway.variable,
    ubuntu.variable,
  ].join(' ')

  return (
    <html lang="pt-BR" className={`${fontVariables} antialiased`} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
