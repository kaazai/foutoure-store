import Image from "next/image"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@/lib/shopify"
import AddToCartButton from "@/components/add-to-cart-button"

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  const images = product.images.edges.map((edge: any) => edge.node)
  const variant = product.variants.edges[0].node

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Image
            src={images[0].url || "/placeholder.svg"}
            alt={images[0].altText || product.title}
            width={500}
            height={500}
            className="w-full object-cover"
          />
          <div className="grid grid-cols-4 gap-4">
            {images.slice(1).map((image: any, index: number) => (
              <Image
                key={index}
                src={image.url || "/placeholder.svg"}
                alt={image.altText || `${product.title} ${index + 2}`}
                width={100}
                height={100}
                className="w-full object-cover"
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl font-semibold">
            {variant.price.amount} {variant.price.currencyCode}
          </p>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
          <AddToCartButton product={product} variant={variant} />
        </div>
      </div>
    </div>
  )
}

