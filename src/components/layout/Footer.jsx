import { memo, useState } from 'react'
import ContactModal from '../modals/ContactModal.jsx'

function Footer() {
  const [showContactModal, setShowContactModal] = useState(false)

  return (
    <>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-600 text-sm">©2025 Edge Marketplace</div>
            <nav className="flex items-center gap-3 text-sm text-gray-600">
              <a href="/about" className="hover:text-gray-900">About Us</a>
              <span>•</span>
              <a href="/privacy" className="hover:text-gray-900">Privacy Policy</a>
              <span>•</span>
              <a href="/terms" className="hover:text-gray-900">Terms of Service</a>
              <span>•</span>
              <a href="/cookies" className="hover:text-gray-900">Cookie Policy</a>
              <span>•</span>
              <a href="/sponsorship" className="hover:text-gray-900">Sponsorship</a>
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
