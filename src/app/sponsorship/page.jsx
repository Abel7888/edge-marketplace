import Sponsorship from '@/pages/Sponsorship'

export const metadata = {
  title: 'Sponsorship | Edge Marketplace',
  description: 'Reach 37,000+ technology decision-makers through our industry newsletters.',
  openGraph: {
    title: 'Sponsorship | Edge Marketplace',
    description: 'Reach 37,000+ technology decision-makers through our industry newsletters.',
    type: 'website',
    url: 'https://edgemarketplace.xyz/sponsorship',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sponsorship | Edge Marketplace',
    description: 'Reach 37,000+ technology decision-makers through our industry newsletters.',
  },
}

export default function SponsorshipPage() {
  return <Sponsorship />
}

