import { getProducts } from "@/lib/shopify"

export default async function TestPage() {
  try {
    const products = await getProducts()
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test Products Page</h1>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(products, null, 2)}
        </pre>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Products</h1>
        <pre className="bg-red-100 p-4 rounded">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </pre>
      </div>
    )
  }
} 