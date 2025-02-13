"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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

export default function AnnouncementBarEditor() {
  const router = useRouter()
  const [settings, setSettings] = useState<AnnouncementSettings>({
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
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/settings/announcements", {
        cache: 'no-store'
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Fetched settings:", data)
      setSettings(data)
      setIsDirty(false)
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      setError(error instanceof Error ? error.message : "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setSettings(prev => {
      const newSettings = field.includes('.')
        ? {
            ...prev,
            gradient: {
              ...prev.gradient,
              [field.split('.')[1]]: value
            }
          }
        : {
            ...prev,
            [field]: value
          }
      setIsDirty(true)
      return newSettings
    })
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
      setIsDirty(false)
      
      // Force a client-side refresh
      router.refresh()
      
      // Force reload of the announcement bar on the home page
      if (typeof window !== 'undefined') {
        const event = new Event('announcementUpdate')
        window.dispatchEvent(event)
      }

      // Refetch settings to ensure sync
      await fetchSettings()
    } catch (error) {
      console.error("Failed to save settings:", error)
      setError(error instanceof Error ? error.message : "Failed to save settings")
      setSaveStatus("error")
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-6">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcement Bar</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store's announcement bar settings and preview changes in real-time.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => fetchSettings()}
            className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isDirty || saveStatus === "saving"}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveStatus === "saving" ? "Saving..." : "Publish Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {saveStatus === "success" && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Changes published successfully!</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Settings</h2>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center h-5">
              <input
                id="enabled"
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleChange("enabled", e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enabled" className="font-medium text-gray-700">Enable Announcement Bar</label>
              <p className="text-gray-500">Show or hide the announcement bar on your store.</p>
            </div>
          </div>

          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Announcement Text
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="text"
                value={settings.text}
                onChange={(e) => handleChange("text", e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., Special offer! 20% off all products"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700">
              Promo Code
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="promoCode"
                value={settings.promoCode}
                onChange={(e) => handleChange("promoCode", e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., SUMMER20"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                id="endDate"
                value={settings.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Colors
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="gradientFrom" className="block text-sm text-gray-500">
                  Start Color
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="color"
                    id="gradientFrom"
                    value={settings.gradient.from}
                    onChange={(e) => handleChange("gradient.from", e.target.value)}
                    className="h-8 w-8 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.gradient.from}
                    onChange={(e) => handleChange("gradient.from", e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="gradientTo" className="block text-sm text-gray-500">
                  End Color
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="color"
                    id="gradientTo"
                    value={settings.gradient.to}
                    onChange={(e) => handleChange("gradient.to", e.target.value)}
                    className="h-8 w-8 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.gradient.to}
                    onChange={(e) => handleChange("gradient.to", e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Live Preview</h2>
          <div className="border rounded-lg overflow-hidden">
            {settings.enabled ? (
              <div
                style={{
                  background: `linear-gradient(to right, ${settings.gradient.from}, ${settings.gradient.to})`,
                }}
                className="relative"
              >
                <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                  <div className="text-center sm:px-16">
                    <p className="font-medium text-white">
                      <span className="md:inline">{settings.text || "Enter announcement text"}</span>
                      {settings.promoCode && (
                        <span className="block sm:ml-2 sm:inline-block">
                          <span className="font-bold">Code: {settings.promoCode}</span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-12 text-center">
                <p className="text-sm text-gray-500">
                  The announcement bar is currently disabled. Enable it to preview how it will look on your store.
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Preview Details</h3>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-xs text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {settings.enabled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Disabled
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">End Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(settings.endDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Time Remaining</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {settings.enabled ? (
                    new Date(settings.endDate) > new Date() ? (
                      `${Math.ceil((new Date(settings.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                    ) : (
                      <span className="text-red-600">Expired</span>
                    )
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 