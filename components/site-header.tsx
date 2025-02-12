"use client"

import Link from "next/link"
import { Menu, Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import CartSidebar from "@/components/cart-sidebar"
import { useAuth } from "@/lib/useAuth"

export default function SiteHeader() {
  const { isAuthenticated, signIn, signOut } = useAuth()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/new" 
              className="text-sm font-medium relative group"
            >
              <span className="relative z-10">NEW</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-black transform origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
            <Link 
              href="/hoodies" 
              className="text-sm font-medium relative group"
            >
              <span className="relative z-10">HOODIES</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-black transform origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
            <Link 
              href="/tees" 
              className="text-sm font-medium relative group"
            >
              <span className="relative z-10">TEES</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-black transform origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          </div>

          <Link href="/" className="text-2xl font-bold">
            FOUTOURE
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            {isAuthenticated ? (
              <>
                <Link href="/account">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => signOut()}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => signIn()}>
                <User className="h-5 w-5" />
              </Button>
            )}
            <CartSidebar />
          </div>
        </div>
      </div>
    </header>
  )
}

