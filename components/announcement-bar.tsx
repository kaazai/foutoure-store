"use client"

import { useState, useEffect } from "react"

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
  const [settings, setSettings] = useState<AnnouncementSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/public/announcements", {
        cache: 'no-store'
      })
      if (!response.ok) {
        console.error("Failed to fetch announcement settings:", response.statusText)
        return
      }

      const data = await response.json()
      
      // Only show if enabled and not expired
      if (data.enabled && new Date(data.endDate) > new Date()) {
        setSettings(data)
      } else {
        setSettings(null)
      }
    } catch (error) {
      console.error("Error fetching announcement settings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()

    // Listen for updates from the admin dashboard
    const handleUpdate = () => {
      console.log("Announcement update event received")
      fetchSettings()
    }

    window.addEventListener('announcementUpdate', handleUpdate)

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchSettings, 30000)

    return () => {
      window.removeEventListener('announcementUpdate', handleUpdate)
      clearInterval(interval)
    }
  }, [])

  if (loading || !settings?.enabled) {
    return null
  }

  return (
    <div
      style={{
        background: `linear-gradient(to right, ${settings.gradient.from}, ${settings.gradient.to})`,
      }}
      className="relative"
    >
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="text-center sm:px-16">
          <p className="font-medium text-white">
            <span className="md:inline">{settings.text}</span>
            {settings.promoCode && (
              <span className="block sm:ml-2 sm:inline-block">
                <span className="font-bold">Code: {settings.promoCode}</span>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

