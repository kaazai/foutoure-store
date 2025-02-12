"use client"

import Marquee from "react-fast-marquee"

export default function MarqueeBanner() {
  return (
    <div className="bg-black text-white py-2 text-sm font-medium">
      <Marquee speed={50} gradient={false}>
        <span className="mx-4">PREMIUM STREETWEAR</span>
        <span className="mx-4">•</span>
        <span className="mx-4">HIGHEST QUALITY MATERIALS</span>
        <span className="mx-4">•</span>
        <span className="mx-4">ORIGINAL DESIGNS</span>
        <span className="mx-4">•</span>
        <span className="mx-4">PREMIUM STREETWEAR</span>
        <span className="mx-4">•</span>
        <span className="mx-4">HIGHEST QUALITY MATERIALS</span>
      </Marquee>
    </div>
  )
}

