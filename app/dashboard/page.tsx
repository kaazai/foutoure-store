"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    enabled: false,
    text: "",
    endDate: new Date().toISOString().split("T")[0],
    promoCode: "",
    gradient: {
      from: "#000000",
      to: "#000000"
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/settings/announcements")
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Fetched settings:", data)
      setSettings(data)
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      setError(error instanceof Error ? error.message : "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaveStatus("saving")
      setError(null)
      const response = await fetch("/api/settings/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Saved settings:", data)
      setSettings(data)
      setSaveStatus("success")
      router.refresh()
    } catch (error) {
      console.error("Failed to save settings:", error)
      setError(error instanceof Error ? error.message : "Failed to save settings")
      setSaveStatus("error")
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      <p className="mt-2 text-sm text-gray-600">
        Welcome to your admin dashboard. Select a section from the sidebar to manage your store content.
      </p>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Announcement Bar
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-lg font-semibold text-gray-900">
                      Active
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/dashboard/content/announcement-bar" className="font-medium text-indigo-600 hover:text-indigo-500">
                Manage settings &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Add more dashboard cards here as you add more features */}
      </div>
    </div>
  )
} 