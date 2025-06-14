import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next";
import { SessionProvider } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]/route";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.variable}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
