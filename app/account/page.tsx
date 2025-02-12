"use client"

import { useAuth } from "@/lib/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AccountPage() {
  const { isAuthenticated, isLoading, session, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <p>Welcome, {session?.user?.name || "Customer"}!</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Account Details</h2>
        <p>Email: {session?.user?.email}</p>
      </div>
      <div className="mt-8">
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    </div>
  )
}

