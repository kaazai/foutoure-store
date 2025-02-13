"use client"

import { useEffect, useState } from "react"
import { XMarkIcon } from '@heroicons/react/24/outline'

interface AnnouncementBarProps {
  text: string
  enabled: boolean
  endDate: string
  promoCode: string
  gradientFrom: string
  gradientTo: string
}

export default function AnnouncementBar({
  text,
  enabled,
  endDate,
  promoCode,
  gradientFrom,
  gradientTo
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasExpired, setHasExpired] = useState(false)

  useEffect(() => {
    // Check if announcement should be shown
    const endDateTime = new Date(endDate)
    const now = new Date()
    setHasExpired(now > endDateTime)
    
    // Show announcement if enabled and not expired
    setIsVisible(enabled && !hasExpired)
  }, [enabled, endDate])

  if (!isVisible) return null

  return (
    <div className={`relative bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`}>
      <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:px-16 sm:text-center">
          <p className="font-medium text-white">
            <span>{text}</span>
            {promoCode && (
              <span className="inline-block bg-white/20 px-2 py-1 ml-2 rounded-md">
                {promoCode}
              </span>
            )}
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-start pt-3 pr-3 sm:items-center sm:pt-0">
          <button
            type="button"
            className="flex rounded-md p-1 hover:bg-white/10 focus:outline-none"
            onClick={() => setIsVisible(false)}
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

