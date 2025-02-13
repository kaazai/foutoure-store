"use client"

import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AccountPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">My Account</h1>
        
        <div className="space-y-6 bg-white p-6 border rounded-lg">
          <div>
            <h2 className="text-lg font-semibold mb-4">Account Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="mt-1 font-medium">{session.user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Account Type</label>
                <p className="mt-1 font-medium capitalize">{session.user?.role || "Customer"}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

