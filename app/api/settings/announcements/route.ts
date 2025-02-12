import { NextResponse } from "next/server"
import { shopifyFetch } from "@/lib/shopify"

export async function GET() {
  try {
    // Fetch metafields containing announcement settings
    const response = await shopifyFetch({
      query: `
        query {
          shop {
            metafields(
              first: 10,
              namespace: "announcements"
            ) {
              edges {
                node {
                  key
                  value
                }
              }
            }
          }
        }
      `
    })

    const metafields = response.data.shop.metafields.edges.reduce((acc: any, edge: any) => {
      acc[edge.node.key] = edge.node.value
      return acc
    }, {})

    return NextResponse.json({
      enabled: metafields.announcement_enabled === "true",
      text: metafields.announcement_text || "",
      endDate: metafields.announcement_end_date || "",
      promoCode: metafields.announcement_promo_code || "",
      gradient: {
        from: metafields.announcement_gradient_from || "purple-600",
        to: metafields.announcement_gradient_to || "pink-600"
      }
    })
  } catch (error) {
    console.error("Failed to fetch announcement settings:", error)
    return NextResponse.json({
      enabled: false,
      text: "",
      endDate: "",
      promoCode: "",
      gradient: { from: "purple-600", to: "pink-600" }
    })
  }
} 