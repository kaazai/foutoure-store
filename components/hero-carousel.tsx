"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setCurrentSlide(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  const slides = [
    {
      image: "/placeholder.svg",
      title: "NEW COLLECTION",
      subtitle: "Spring/Summer 2024",
      cta: "Shop Now",
    },
    {
      image: "/placeholder.svg",
      title: "VALENTINE'S SPECIAL",
      subtitle: "Get 20% Off with code LOVE20",
      cta: "Shop Collection",
    },
  ]

  return (
    <div className="relative h-[calc(100vh-7rem)]">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                width={1920}
                height={1080}
                className="object-cover w-full h-full"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-center">
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-4xl font-bold">{slide.title}</h1>
                  <p className="text-base md:text-lg">{slide.subtitle}</p>
                  <Button
                    size="default"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-black mt-2"
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 transition-colors duration-200"
        onClick={() => emblaApi?.scrollPrev()}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 transition-colors duration-200"
        onClick={() => emblaApi?.scrollNext()}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white w-6" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}

