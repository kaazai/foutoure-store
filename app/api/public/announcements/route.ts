import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Get the latest announcement settings
    const settings = await prisma.announcementSettings.findFirst({
      orderBy: { createdAt: "desc" }
    })

    if (!settings) {
      const response = NextResponse.json({
        enabled: false,
        text: "",
        endDate: new Date().toISOString(),
        promoCode: "",
        gradient: {
          from: "#000000",
          to: "#000000"
        }
      })
      response.headers.set('Cache-Control', 'no-store')
      return response
    }

    // Transform the data structure to match frontend expectations
    const transformedSettings = {
      enabled: settings.enabled,
      text: settings.text,
      endDate: settings.endDate.toISOString(),
      promoCode: settings.promoCode,
      gradient: {
        from: settings.gradientFrom,
        to: settings.gradientTo
      }
    }

    const response = NextResponse.json(transformedSettings)
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    console.error("Failed to fetch public announcement settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 