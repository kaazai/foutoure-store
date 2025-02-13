"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-red-600 hover:text-red-500"
    >
      Sign out
    </button>
  )
} 