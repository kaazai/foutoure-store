import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnnouncementBar from '@/components/announcement-bar'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FOUTOURE - Premium Streetwear',
  description: 'Premium streetwear clothing and accessories.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex min-h-full flex-col`}>
        <Providers>
          <AnnouncementBar
            enabled={true}
            text="Welcome to FOUTOURE - Premium Streetwear"
            endDate="2026-02-13T07:03:31Z"
            promoCode="WELCOME20"
            gradientFrom="purple-600"
            gradientTo="pink-600"
          />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
