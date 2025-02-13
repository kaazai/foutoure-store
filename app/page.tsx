import HeroCarousel from "@/components/hero-carousel"
import FeaturedCollections from "@/components/featured-collections"
import NewsletterSignup from "@/components/newsletter-signup"
import { getProducts } from "@/lib/shopify"
import ProductCard from "@/components/product-card"

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function Home() {
  const products = await getProducts()

  return (
    <div>
      <HeroCarousel />
      <FeaturedCollections />
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      <NewsletterSignup />
    </div>
  )
}

