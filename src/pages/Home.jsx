'use client'


import { useState } from 'react'
import HeroSection from '../components/home/HeroSection.jsx'
import TrustBar from '../components/home/TrustBar.jsx'
import CategoryShowcase from '../components/home/CategoryShowcase.jsx'
import ProcessTimeline from '../components/home/ProcessTimeline.jsx'
import FeaturedVendors from '../components/home/FeaturedVendors.jsx'
import StatsSection from '../components/home/StatsSection.jsx'
import DualCTA from '../components/home/DualCTA.jsx'
import FAQSection from '../components/home/FAQSection.jsx'
import ContactModal from '../components/modals/ContactModal.jsx'

export default function Home() {
  const [showContactModal, setShowContactModal] = useState(false)

  return (
    <main>
      <HeroSection />
      <TrustBar
        title="Chosen by organizations seeking clarity and confidence"
        logos={[
          { name: 'Commercial Real Estate' },
          { name: 'Multifamily Housing' },
          { name: 'Financial Services & Banking' },
          { name: 'Wealth Management' },
          { name: 'Consulting Firms' },
          { name: 'Supply Chain & Logistics' },
          { name: 'Manufacturing' },
          { name: 'Transportation' },
          { name: 'Healthcare & Hospitals' },
          { name: 'Pharmaceutical & Life Sciences' },
        ]}
      />
      <CategoryShowcase />
      <ProcessTimeline />
      <FeaturedVendors />
      <StatsSection />
      <DualCTA />
      <FAQSection onContactClick={() => setShowContactModal(true)} />
      
      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </main>
  )
}

