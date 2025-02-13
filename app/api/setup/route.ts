import { NextResponse } from "next/server"
import { setupMetafieldDefinitions } from "@/lib/shopify"

export async function POST() {
  try {
    // Create and set up the metafields
    console.log('Starting metafield setup...')
    const results = await setupMetafieldDefinitions()
    console.log('Created metafields:', results)

    return NextResponse.json({ 
      success: true, 
      results
    })
  } catch (error) {
    console.error('Setup error:', error)
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'object' && error !== null && 'message' in error 
        ? error.message 
        : 'Unknown error'
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.stack : error
      },
      { status: 500 }
    )
  }
} 