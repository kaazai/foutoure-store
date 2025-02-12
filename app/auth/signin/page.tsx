"use client"

import { useEffect } from "react"
import { signIn } from "next-auth/react"

export default function SignIn() {
  useEffect(() => {
    signIn("shopify", { callbackUrl: "/" })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Redirecting to Shopify...</h1>
        <p>Please wait while we redirect you to Shopify for authentication.</p>
      </div>
    </div>
  )
} 