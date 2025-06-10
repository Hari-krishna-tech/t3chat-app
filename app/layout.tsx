import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  metadataBase: new URL('https://t3chat-app.vercel.app/'),
  title: 'T3 Chat',
  description:
    'T3 Chat is a simple chat application built with Next.js, Shadcn, Tailwind, and Vercel Postgres',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
