import Image from "next/image"
import Link from "next/link"

const collections = [
  {
    name: "Hoodies",
    image: "/placeholder.svg",
    slug: "hoodies",
  },
  {
    name: "T-Shirts",
    image: "/placeholder.svg",
    slug: "t-shirts",
  },
  {
    name: "Accessories",
    image: "/placeholder.svg",
    slug: "accessories",
  },
]

export default function FeaturedCollections() {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-8">Shop Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group relative aspect-square overflow-hidden bg-gray-100"
            >
              <Image
                src={collection.image || "/placeholder.svg"}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{collection.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

