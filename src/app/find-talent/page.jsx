import FindTalent from '@/pages/FindTalent'

export const metadata = {
  title: 'Find Talent | Edge Marketplace',
  description: 'Connect with top emerging tech professionals on Edge Marketplace.',
  openGraph: {
    title: 'Find Talent | Edge Marketplace',
    description: 'Connect with top emerging tech professionals on Edge Marketplace.',
    type: 'website',
    url: 'https://edgemarketplace.xyz/find-talent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Talent | Edge Marketplace',
    description: 'Connect with top emerging tech professionals on Edge Marketplace.',
  },
}

export default function FindTalentPage() {
  return <FindTalent />
}
