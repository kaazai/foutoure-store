import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      console.error("GET /api/settings/announcements: Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Fetching announcement settings for user:", session.user?.email)
    const settings = await prisma.announcementSettings.findFirst({
      orderBy: { createdAt: "desc" }
    })

    console.log("Raw settings from database:", settings)

    // Transform the data structure to match frontend expectations
    const transformedSettings = settings ? {
      enabled: settings.enabled,
      text: settings.text,
      endDate: settings.endDate.toISOString().split('T')[0],
      promoCode: settings.promoCode,
      gradient: {
        from: settings.gradientFrom,
        to: settings.gradientTo
      }
    } : {
      enabled: false,
      text: "",
      endDate: new Date().toISOString().split('T')[0],
      promoCode: "",
      gradient: {
        from: "#000000",
        to: "#000000"
      }
    }

    console.log("Transformed settings for frontend:", transformedSettings)
    
    const response = NextResponse.json(transformedSettings)
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    console.error("Failed to fetch announcement settings:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      console.error("POST /api/settings/announcements: Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Updating announcement settings for user:", session.user?.email)
    const data = await request.json()
    console.log("Received data:", data)

    if (!data.text || !data.endDate || !data.promoCode) {
      console.error("Missing required fields in request:", data)
      return NextResponse.json(
        { error: "Missing required fields", details: "text, endDate, and promoCode are required" },
        { status: 400 }
      )
    }

    const settings = await prisma.announcementSettings.create({
      data: {
        enabled: data.enabled,
        text: data.text,
        endDate: new Date(data.endDate),
        promoCode: data.promoCode,
        gradientFrom: data.gradient.from,
        gradientTo: data.gradient.to
      }
    })

    // Transform the response to match frontend expectations
    const transformedSettings = {
      enabled: settings.enabled,
      text: settings.text,
      endDate: settings.endDate.toISOString().split('T')[0],
      promoCode: settings.promoCode,
      gradient: {
        from: settings.gradientFrom,
        to: settings.gradientTo
      }
    }

    console.log("Successfully created new settings:", transformedSettings)
    
    // Revalidate the public announcements endpoint
    revalidatePath('/')
    
    const response = NextResponse.json(transformedSettings)
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    console.error("Failed to save announcement settings:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 