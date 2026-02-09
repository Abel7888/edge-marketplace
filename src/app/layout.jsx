import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Edge Marketplace - Emerging Tech Solutions',
  description: 'Discover, review, and connect with emerging technology vendors. AI, Blockchain, IoT, and beyond.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo-icon.svg',
  },
  openGraph: {
    title: 'Edge Marketplace - Emerging Tech Solutions',
    description: 'Discover, review, and connect with emerging technology vendors. AI, Blockchain, IoT, and beyond.',
    type: 'website',
    url: 'https://edgemarketplace.xyz',
    siteName: 'Edge Marketplace',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edge Marketplace - Emerging Tech Solutions',
    description: 'Discover, review, and connect with emerging technology vendors. AI, Blockchain, IoT, and beyond.',
  },
  metadataBase: new URL('https://edgemarketplace.xyz'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

