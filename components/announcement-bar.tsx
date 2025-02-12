"use client"

import { useEffect, useState } from "react"

interface AnnouncementSettings {
  enabled: boolean
  text: string
  endDate: string
  promoCode: string
  gradient: {
    from: string
    to: string
  }
}

export default function AnnouncementBar() {
  const [settings, setSettings] = useState<AnnouncementSettings>({
    enabled: false,
    text: "",
    endDate: "",
    promoCode: "",
    gradient: { from: "purple-600", to: "pink-600" }
  })

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    // Fetch settings from our API
    fetch("/api/settings/announcements")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(error => console.error("Failed to fetch announcement settings:", error))
  }, [])

  useEffect(() => {
    if (!settings.enabled || !settings.endDate) return

    const calculateTimeLeft = () => {
      const now = new Date()
      const target = new Date(settings.endDate)
      const difference = target.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
        return null
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false })
      return difference
    }

    const remainingTime = calculateTimeLeft()
    const timer = remainingTime !== null ? setInterval(calculateTimeLeft, 1000) : undefined

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [settings.enabled, settings.endDate])

  if (!settings.enabled || timeLeft.isExpired) {
    return null
  }

  return (
    <div className={`bg-gradient-to-r from-${settings.gradient.from} to-${settings.gradient.to} text-white py-2`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-center text-sm">
          <div className="font-medium tracking-wide">
            {settings.text}
          </div>
          <div className="mx-2 font-medium">|</div>
          <div className="font-mono tracking-wider flex items-center gap-[2px]">
            <div className="flex flex-col items-center">
              <span className="inline-block w-[2ch] font-medium">{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="text-[8px] font-medium tracking-wider opacity-80">DAYS</span>
            </div>
            <span className="mx-[1px]">:</span>
            <div className="flex flex-col items-center">
              <span className="inline-block w-[2ch] font-medium">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-[8px] font-medium tracking-wider opacity-80">HRS</span>
            </div>
            <span className="mx-[1px]">:</span>
            <div className="flex flex-col items-center">
              <span className="inline-block w-[2ch] font-medium">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-[8px] font-medium tracking-wider opacity-80">MIN</span>
            </div>
            <span className="mx-[1px]">:</span>
            <div className="flex flex-col items-center">
              <span className="inline-block w-[2ch] font-medium">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-[8px] font-medium tracking-wider opacity-80">SEC</span>
            </div>
          </div>
          <div className="mx-2 font-medium">|</div>
          <div className="font-medium tracking-wide">
            USE CODE: <span className="font-bold relative inline-block group">
              {settings.promoCode}
              <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-sm" />
            </span> TODAY!
          </div>
        </div>
      </div>
    </div>
  )
}

