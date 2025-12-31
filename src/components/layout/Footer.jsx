'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import ContactModal from '@/components/modals/ContactModal'

function Footer() {
  const [showContactModal, setShowContactModal] = useState(false)

  return (
    <>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-600 text-sm">©2025 Edge Marketplace</div>
            <nav className="flex items-center gap-3 text-sm text-gray-600">
              <Link href="/about" className="hover:text-gray-900">About Us</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
              <span>•</span>
              <Link href="/cookies" className="hover:text-gray-900">Cookie Policy</Link>
              <span>•</span>
              <Link href="/sponsorship" className="hover:text-gray-900">Sponsorship</Link>
              <span>•</span>
              <Link href="/blog" className="hover:text-gray-900">Blog</Link>
              <span>•</span>
              <button 
                onClick={() => setShowContactModal(true)}
                className="hover:text-gray-900"
              >
                Contact Us
              </button>
            </nav>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </>
  )
}

export default Footer

