import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import AddToCartButton from "@/components/add-to-cart-button"

interface ProductCardProps {
  product: {
    id: string
    title: string
    handle: string
    images: { edges: { node: { url: string; altText: string } }[] }
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
    variants: { edges: { node: any }[] }
  }
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const image = product.images.edges[0]?.node
  const price = product.priceRange.minVariantPrice
  const variant = product.variants.edges[0]?.node

  return (
    <div className={cn("group block", className)}>
      <Link href={`/products/${product.handle}`} className="relative aspect-[3/4] overflow-hidden bg-gray-100 block">
        <Image
          src={image.url || "/placeholder.svg"}
          alt={image.altText || product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="mt-4 space-y-1">
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-sm font-medium">{product.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          {price.amount} {price.currencyCode}
        </p>
        <AddToCartButton product={product} variant={variant} />
      </div>
    </div>
  )
}

