'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { X, ChevronDown, LogOut, Home, Building2, Cpu, Server, MessageCircle, Zap } from 'lucide-react'

function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastYRef = useRef(0)
  const [profileOpen, setProfileOpen] = useState(false)
  const [industryOpen, setIndustryOpen] = useState(false)
  const [technologyOpen, setTechnologyOpen] = useState(false)
  const [infrastructureOpen, setInfrastructureOpen] = useState(false)
    const { currentUser, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    let rafId = 0
    const onScroll = () => {
      const y = window.scrollY
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setHidden(y > lastYRef.current && y > 100)
        setScrolled(y > 10)
        lastYRef.current = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled ? 'bg-white shadow-sm border-gray-100' : 'bg-white border-gray-50'}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-3">
              <img src="/logo-icon.svg" alt="Edge Marketplace" className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-gray-900 leading-tight">EDGE</div>
                <div className="text-xs text-blue-600 font-semibold">Marketplace</div>
              </div>
            </div>
          </Link>

          {/* Center: Navigation Dropdowns */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {/* Browse by Industry */}
            <div className="relative" onMouseEnter={() => setIndustryOpen(true)} onMouseLeave={() => setIndustryOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                <Building2 size={16} />
                Browse by Industry
                <ChevronDown size={14} className={`transition-transform ${industryOpen ? 'rotate-180' : ''}`} />
              </button>
              {industryOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 z-50">
                  <Link href="/discover/fintech" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">💰 Finance</Link>
                  <Link href="/discover/proptech" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">🏢 Real Estate</Link>
                  <Link href="/discover/contech" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">🏗️ Construction</Link>
                  <Link href="/discover/healthtech" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">🏥 Healthcare</Link>
                  <Link href="/discover/medtech" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">💊 Medical Technology</Link>
                  <Link href="/discover/supplychain" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">🏭 Supply Chain & Logistics</Link>
                </div>
              )}
            </div>

            {/* Browse by Technology */}
            <div className="relative" onMouseEnter={() => setTechnologyOpen(true)} onMouseLeave={() => setTechnologyOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                <Cpu size={16} />
                Browse by Technology
                <ChevronDown size={14} className={`transition-transform ${technologyOpen ? 'rotate-180' : ''}`} />
              </button>
              {technologyOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 z-50">
                  <Link href="/discover/ai" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">🤖 AI & Automation</Link>
                  <Link href="/discover/ml" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">📊 Data & Machine Learning</Link>
                  <Link href="/discover/iot" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">🌐 Internet of Things (IoT)</Link>
                  <Link href="/discover/web3" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">⛓️ Blockchain</Link>
                  <Link href="/discover/arvr" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">🥽 AR/VR</Link>
                  <Link href="/discover/digital-twin" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">👥 Digital Twins</Link>
                  <Link href="/discover/edge-computing" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">⚡ Edge Computing</Link>
                </div>
              )}
            </div>

            {/* Browse by Infrastructure */}
            <div className="relative" onMouseEnter={() => setInfrastructureOpen(true)} onMouseLeave={() => setInfrastructureOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                <Server size={16} />
                Browse by Infrastructure
                <ChevronDown size={14} className={`transition-transform ${infrastructureOpen ? 'rotate-180' : ''}`} />
              </button>
              {infrastructureOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 z-50">
                  <Link href="/discover/semiconductors" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">💻 Chips & Computing</Link>
                  <Link href="/discover/networking" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">🌐 Networks & Connectivity</Link>
                  <Link href="/discover/automation-robotics" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">🤖 Robots & Automation</Link>
                  <Link href="/discover/power-infrastructure" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">⚡ Power & Energy</Link>
                  <Link href="/discover/3d-printing" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">🖨️ 3D Printing</Link>
                  <Link href="/discover/quantum-computing" className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">⚛️ Next-Gen Computing</Link>
                </div>
              )}
            </div>

          </div>

          {/* Right: Auth */}
          <div className="ml-auto flex items-center gap-2">
            {!currentUser && (
              <>
                <Link href="/login" className="hidden md:inline-flex items-center justify-center px-3 h-10 rounded-lg border-2 border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50">Sign In</Link>
                <Link href="/signup" className="hidden md:inline-flex items-center justify-center px-3 h-10 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:shadow-lg">Sign Up</Link>
              </>
            )}
            {currentUser && (
              <>
                <Link href="/discover" className="hidden md:inline-flex items-center justify-center gap-2 px-4 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg transition-all">
                  <Home size={16} />
                  Home
                </Link>
                <div className="relative">
                  <button onClick={() => setProfileOpen(v => !v)} className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-bold flex items-center justify-center">
                      {String(currentUser.displayName || currentUser.email || 'U').trim().split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                    <ChevronDown size={16} className="text-gray-600" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl w-64 p-2 z-50">
                      <div className="px-3 py-2">
                        <div className="font-semibold text-slate-900">{currentUser.displayName || 'User'}</div>
                        <div className="text-sm text-gray-600">{currentUser.email}</div>
                      </div>
                      <div className="my-2 h-px bg-gray-100" />
                      <button onClick={async () => { try { await logout(); router.push('/'); } catch {} }} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600"><LogOut size={16} /> Sign Out</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
