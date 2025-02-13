import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Shop</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/products" className="text-base text-gray-500 hover:text-gray-900">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="text-base text-gray-500 hover:text-gray-900">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/best-sellers" className="text-base text-gray-500 hover:text-gray-900">
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Customer Service</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/shipping" className="text-base text-gray-500 hover:text-gray-900">
                    Shipping Information
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-base text-gray-500 hover:text-gray-900">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-base text-gray-500 hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 py-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} FOUTOURE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 