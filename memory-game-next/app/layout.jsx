import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({
  children,
}) {
  return (
    <html lang="es" className={`${inter.variable} bg-[#EFEFEF] antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#EFEFEF] font-sans text-[#1A1D20]">{children}</body>
    </html>
  )
}