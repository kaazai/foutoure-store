import { Inter } from "next/font/google"
import MarqueeBanner from "@/components/marquee-banner"
import AnnouncementBar from "@/components/announcement-bar"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Providers } from "./providers"
import "./globals.css"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <MarqueeBanner />
          <div className="sticky top-0 z-50 bg-white">
            <SiteHeader />
          </div>
          <AnnouncementBar />
          <main>{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
