'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize Google Analytics
    const GA_MEASUREMENT_ID = 'G-BKVRGZ5CMY'
    
    // Load gtag.js script
    if (!window.gtag) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      function gtag() {
        window.dataLayer.push(arguments)
      }
      window.gtag = gtag
      gtag('js', new Date())
      gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false // We'll send page views manually
      })
    }
  }, [])

  useEffect(() => {
    // Track page views on route change
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname + (searchParams?.toString() ? '?' + searchParams.toString() : ''),
        page_title: document.title,
        page_location: window.location.href
      })
    }
  }, [pathname, searchParams])

  return null
}

// Custom event tracking hook
export function useAnalytics() {
  const trackEvent = (eventName, eventParams = {}) => {
    if (window.gtag) {
      window.gtag('event', eventName, eventParams)
    }
  }

  return { trackEvent }
}

