import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Providers from "@/components/Providers";
import PWARegistration from "@/components/PWARegistration";

export const metadata = {
  metadataBase: new URL('https://t3chat-app.vercel.app/'),
  title: 'T3 Chat',
  description:
    'T3 Chat is a simple chat application built with Next.js, Tailwind, and Postgres',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  other: {
    'theme-color': '#0a0a0f',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
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
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.variable}>
        <Providers session={session}>
          {children}
        </Providers>
        <PWARegistration />
      </body>
    </html>
  )
}
