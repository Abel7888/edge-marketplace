import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'edge-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      if (v) {
        // Already accepted, hide banner
        setVisible(false)
      }
    } catch {
      // if storage blocked, show banner
      setVisible(true)
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, ts: Date.now() }))
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pb-4">
        <div className="rounded-xl border border-gray-200 bg-white/95 backdrop-blur shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-gray-700">
              We use only essential cookies for security, authentication, and core functionality, plus basic usage data to improve Edge Marketplace. See our{' '}
              <a href="/privacy" className="text-[#0F1B3C] underline hover:no-underline">Privacy Policy</a> and{' '}
              <a href="/cookies" className="text-[#0F1B3C] underline hover:no-underline">Cookie Policy</a>.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={accept}
                className="inline-flex items-center justify-center rounded-lg bg-[linear-gradient(135deg,#00F5FF,#00D9FF)] text-[#0A0E1F] px-4 py-2 text-sm font-semibold shadow-[0_6px_18px_rgba(0,245,255,0.35)] focus:outline-none focus:ring-4 focus:ring-[#00F5FF]"
              >
                Accept
              </button>
              <a
                href="/cookies"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

