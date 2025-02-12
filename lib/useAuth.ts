import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"

  const signIn = () => {
    return nextAuthSignIn("shopify", {
      callbackUrl: window.location.href,
    })
  }

  const signOut = () => {
    return nextAuthSignOut({
      callbackUrl: window.location.href,
    })
  }

  return {
    isAuthenticated,
    isLoading,
    user: session?.user,
    signIn,
    signOut,
  }
} 