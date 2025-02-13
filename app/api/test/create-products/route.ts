import { NextResponse } from "next/server"
import { createSampleProducts, updateProductImages } from "@/lib/shopify"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST() {
  try {
    const products = await createSampleProducts()
    
    // Add images to each product
    for (const product of products) {
      await updateProductImages(product.id)
    }

    // Wait for 5 seconds to allow for indexing
    console.log('Waiting for products to be indexed...')
    await delay(5000)

    return NextResponse.json({ 
      success: true, 
      message: "Sample products created successfully", 
      products 
    })
  } catch (error) {
    console.error("Failed to create sample products:", error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to create products" 
    }, { status: 500 })
  }
} 