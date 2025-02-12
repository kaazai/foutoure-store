"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

export default function AddToCartButton({ product, variant }: any) {
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem({
      id: variant.id,
      title: product.title,
      price: Number.parseFloat(variant.price.amount),
      quantity: 1,
      image: product.images.edges[0].node.url,
    })
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <Button onClick={handleAddToCart} disabled={isAdding}>
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  )
}

