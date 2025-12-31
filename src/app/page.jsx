'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const HeroSection = dynamic(() => import('@/components/home/HeroSection'), { ssr: false })
const TrustBar = dynamic(() => import('@/components/home/TrustBar'), { ssr: false })
const CategoryShowcase = dynamic(() => import('@/components/home/CategoryShowcase'), { ssr: false })
const ProcessTimeline = dynamic(() => import('@/components/home/ProcessTimeline'), { ssr: false })
const FeaturedVendors = dynamic(() => import('@/components/home/FeaturedVendors'), { ssr: false })
const StatsSection = dynamic(() => import('@/components/home/StatsSection'), { ssr: false })
const DualCTA = dynamic(() => import('@/components/home/DualCTA'), { ssr: false })
const FAQSection = dynamic(() => import('@/components/home/FAQSection'), { ssr: false })
const ContactModal = dynamic(() => import('@/components/modals/ContactModal'), { ssr: false })

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
      
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </main>
  )
}

