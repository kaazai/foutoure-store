import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-gray-200 py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              FOUTOURE
            </Link>
            <div className="ml-10 hidden space-x-8 lg:block">
              <Link href="/products" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Shop
              </Link>
              <Link href="/about" className="text-base font-medium text-gray-500 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <Link href="/account" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Account
            </Link>
            <Link href="/cart" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Cart
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 py-4 lg:hidden">
          <Link href="/products" className="text-base font-medium text-gray-500 hover:text-gray-900">
            Shop
          </Link>
          <Link href="/about" className="text-base font-medium text-gray-500 hover:text-gray-900">
            About
          </Link>
          <Link href="/contact" className="text-base font-medium text-gray-500 hover:text-gray-900">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  )
} 