import NextAuth from "next-auth"
import type { AuthOptions } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

const handler = NextAuth({
  providers: [
    {
      id: "shopify",
      name: "Shopify",
      type: "oauth",
      authorization: {
        url: `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/oauth/authorize`,
        params: {
          scope: "read_products write_products",
          client_id: process.env.SHOPIFY_API_KEY,
        },
      },
      token: {
        url: `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`,
      },
      userinfo: {
        url: `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/shop.json`,
      },
      clientId: process.env.SHOPIFY_API_KEY,
      clientSecret: process.env.SHOPIFY_API_SECRET_KEY,
      profile(profile) {
        return {
          id: profile.shop.id.toString(),
          name: profile.shop.name,
          email: profile.shop.email,
          image: profile.shop.domain,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST }

