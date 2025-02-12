import ProductCard from "./product-card"

const products = [
  {
    id: "1",
    name: "FOUTOURE Essential Hoodie",
    price: "$129.00",
    images: ["/placeholder.svg", "/placeholder.svg"],
    slug: "essential-hoodie",
  },
  {
    id: "2",
    name: "FOUTOURE Graphic Tee",
    price: "$49.00",
    images: ["/placeholder.svg", "/placeholder.svg"],
    slug: "graphic-tee",
  },
  {
    id: "3",
    name: "FOUTOURE Cargo Pants",
    price: "$149.00",
    images: ["/placeholder.svg", "/placeholder.svg"],
    slug: "cargo-pants",
  },
  {
    id: "4",
    name: "FOUTOURE Varsity Jacket",
    price: "$249.00",
    images: ["/placeholder.svg", "/placeholder.svg"],
    slug: "varsity-jacket",
  },
]

export default function NewArrivals() {
  return (
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
  )
}

