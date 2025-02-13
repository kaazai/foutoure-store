import { Inter } from "next/font/google"
import MarqueeBanner from "@/components/marquee-banner"
import AnnouncementBar from "@/components/announcement-bar"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Providers } from "./providers"
import "./globals.css"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'FOUTOURE Store',
  description: 'Your premium streetwear destination',
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <MarqueeBanner />
            <div className="sticky top-0 z-50 bg-white">
              <SiteHeader />
            </div>
            <AnnouncementBar />
            <main className="flex-grow">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
