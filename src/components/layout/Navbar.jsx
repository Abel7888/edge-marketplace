'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Menu, X, Zap, ChevronDown, LogOut, Home } from 'lucide-react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastYRef = useRef(0)
  const [profileOpen, setProfileOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const router = useRouter()

  const navLinks = useMemo(() => [
    { label: 'Browse', hasMega: true },
    { label: 'Solutions' },
    { label: 'Vendors' },
    { label: 'Resources' },
  ], [])

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${scrolled ? 'bg-white shadow-sm border-gray-100' : 'bg-white border-gray-50'}`}
      role="navigation"
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.svg" alt="Edge Marketplace" className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-900 leading-tight">EDGE</div>
              <div className="text-xs text-blue-600 font-semibold">Marketplace</div>
            </div>
          </div>
        </Link>


        {/* Right: Auth Links or Greeting + Notifications + Hamburger */}
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
              <div className="hidden md:flex items-center gap-2 pr-1 text-sm text-gray-700">
                <span className="hidden sm:inline">Welcome, {String(currentUser.displayName||currentUser.email||'User').split(' ')[0]}</span>
              </div>
            </>
          )}
          {currentUser && (
            <div className="relative">
              <button onClick={()=>setProfileOpen(v=>!v)} className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-bold flex items-center justify-center">
                  {String(currentUser.displayName||currentUser.email||'U').trim().split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
                </span>
                <ChevronDown size={16} className="text-gray-600" />
              </button>
              {profileOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl w-64 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2">
                      <div className="font-semibold text-slate-900">{currentUser.displayName||'User'}</div>
                      <div className="text-sm text-gray-600">{currentUser.email}</div>
                    </div>
                    <div className="my-2 h-px bg-gray-100" />
                    <button onClick={async () => { try { await logout(); router.push('/'); } catch {} }} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600"><LogOut size={16} /> Sign Out</button>
                  </div>
                )}
            </div>
          )}
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className={`transition-transform duration-200 ${menuOpen ? 'rotate-90' : ''}`}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-150"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {menuOpen && (
          <aside
            id="mobile-menu"
            className="lg:hidden fixed right-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 z-50 animate-in slide-in-from-right duration-250"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Zap className="text-white" size={18} />
                </span>
                <span className="font-semibold">EDGE Marketplace</span>
              </div>
              <button
                className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="divide-y divide-gray-100">
              {navLinks.map((n) => (
                <a key={n.label} href="#" className="block py-4 text-gray-800 font-medium">
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 space-y-3">
              {!currentUser && (
                <>
                  <Link href="/login" className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-800 hover:bg-gray-50">Sign In</Link>
                  <Link href="/signup" className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:shadow-lg">Sign Up</Link>
                </>
              )}
              {currentUser && (
                <>
                  <div className="px-2 text-sm text-gray-700">Welcome, {String(currentUser.displayName||currentUser.email||'User').split(' ')[0]}</div>
                  <button onClick={async () => { try { await logout(); router.push('/'); } catch {} }} className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl border font-semibold text-gray-800 hover:bg-gray-50">Logout</button>
                </>
              )}
            </div>
          </aside>
        )}
    </nav>
  )
}

export default Navbar
