import { useMemo, useState } from 'react'
import {
  Home,
  Compass,
  Target,
  Bookmark,
  FileText,
  Clock,
  MessageSquare,
  Users,
  Building2,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  ChevronDown,
  Sparkles
} from 'lucide-react'

export default function Sidebar({ activeKey = 'discover', onChange = () => {}, mobileOpen = false, onClose = () => {} }) {
  const [discoverOpen, setDiscoverOpen] = useState(true)
  const [hoverHire, setHoverHire] = useState(false)

  const items = useMemo(() => ([
    {
      group: 'DISCOVER',
      entries: [
        { key: 'home', label: 'Home', icon: Home, subtitle: 'Dashboard overview' },
        { key: 'discover', label: 'Discover Vendors', icon: Compass, badge: '270 vendors', submenu: [
          { key: 'discover-industry', label: 'By Industry' },
          { key: 'discover-tech', label: 'By Technology' },
          { key: 'discover-featured', label: 'Featured' },
          { key: 'discover-newest', label: 'Newest' },
        ]},
        { key: 'recommended', label: 'Recommended', icon: Target, badge: '8 new', pulse: true, subtitle: 'AI-matched for you', iconRight: Sparkles },
      ],
    },
    {
      group: 'MY WORKSPACE',
      entries: [
        { key: 'saved', label: 'Saved Vendors', icon: Bookmark, badge: '12' },
        { key: 'requests', label: 'My Requests', icon: FileText, badge: '5 active', badgeColor: 'blue' },
        { key: 'history', label: 'Search History', icon: Clock },
        { key: 'messages', label: 'Messages', icon: MessageSquare, badgeDot: true },
      ],
    },
    {
      group: 'BUILD YOUR TEAM',
      gradient: true,
      entries: [
        { key: 'hire', label: 'Hire Dev Team', icon: Users, subtitle: 'Eng + Design + PM', new: true, preview: true },
        { key: 'firms', label: 'Partner Firms', icon: Building2, badge: '15 verified firms', subtitle: 'End-to-end development' },
      ],
    },
    {
      group: 'INSIGHTS & TOOLS',
      entries: [
        { key: 'insights', label: 'Market Insights', icon: TrendingUp, subtitle: 'Trends & reports' },
        { key: 'vet', label: 'Vet a Vendor', icon: ShieldCheck, subtitle: 'Get our expert review' },
        { key: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'Updated daily' },
      ],
    },
  ]), [])

  const isActive = (key) => activeKey === key

  const NavItem = ({ entry }) => {
    const Icon = entry.icon
    const RightIcon = entry.iconRight
    const active = isActive(entry.key)
    const hasSub = Array.isArray(entry.submenu)

    return (
      <div className="relative">
        <button
          onClick={() => {
            onChange(entry.key)
            if (hasSub) setDiscoverOpen((v) => !v)
          }}
          title={`${entry.label}${entry.subtitle ? ' - ' + entry.subtitle : ''}`}
          className={`group w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
            active
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 shadow-sm font-semibold'
              : 'hover:bg-gray-100'
          } ${entry.gradient ? 'bg-gradient-to-r from-blue-50/60 to-purple-50/60' : ''}`}
        >
          <Icon size={18} className={`${active ? 'text-blue-600' : 'text-gray-700'} group-hover:scale-105 transition-transform`} />
          <div className="min-w-0">
            <div className={`truncate ${active ? 'text-slate-900' : 'text-gray-800'}`}>{entry.label}</div>
            {entry.subtitle && (
              <div className="text-xs text-gray-500 truncate">{entry.subtitle}</div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {RightIcon && <RightIcon size={14} className="text-blue-600" />}
            {entry.badge && (
              <span className={`relative text-xs px-2 py-0.5 rounded-full ${
                entry.badgeColor === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              } ${entry.pulse ? 'animate-pulse' : ''}`}>{entry.badge}</span>
            )}
            {entry.badgeDot && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
            {hasSub && (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </div>
        </button>
        {entry.key === 'saved' && (
          <div className="mt-2 px-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Compared 3 of 12</span>
              <span>25%</span>
            </div>
            <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-blue-500 rounded-full" />
            </div>
          </div>
        )}
        {entry.key === 'discover' && discoverOpen && (
              <div className="ml-9 mt-2 space-y-1">
                {entry.submenu.map((s) => (
                  <button key={s.key} onClick={() => onChange(s.key)} className="relative w-full text-left px-3 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300" />
                    <span className="ml-4">{s.label}</span>
                  </button>
                ))}
              </div>
            )}
        {entry.key === 'hire' && hoverHire && (
          <div className="absolute left-full top-0 ml-3 w-64 bg-white rounded-xl shadow-hard p-3 z-50">
            <div className="font-semibold text-slate-900">Need developers?</div>
            <div className="text-sm text-gray-600">Browse 15 vetted firms</div>
            <div className="text-sm text-gray-600">Or build custom team</div>
            <div className="mt-2 text-sm text-blue-600 font-semibold">See pricing →</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={onClose}
            />
            <aside
              className="fixed top-0 bottom-0 left-0 w-72 bg-gradient-to-b from-gray-50 to-white shadow-inner z-50 border-r border-gray-100"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                <div className="text-sm font-semibold">Menu</div>
                <button onClick={onClose} className="px-3 py-1.5 rounded-lg hover:bg-gray-100">Close</button>
              </div>
              <div className="overflow-y-auto h-[calc(100vh-4rem)] p-3">
                <div className="flex items-center gap-3 p-3">
                  <span className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white text-xl font-bold flex items-center justify-center">JD</span>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">John Doe</div>
                    <div className="text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">Premium Buyer</div>
                  </div>
                </div>
                <div className="px-3 text-xs text-gray-500 flex items-center gap-4">
                  <span>5 Active Requests</span>
                  <span>12 Saved Vendors</span>
                </div>
                <div className="mt-4 space-y-6">
                  {items.map((g) => (
                    <div key={g.group}>
                      <div className={`px-3 text-xs uppercase ${g.gradient ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600' : 'text-gray-500'}`}>{g.group}</div>
                      <div className="mt-2 space-y-2">
                        {g.entries.map((e) => (
                          <div key={e.key} onMouseEnter={() => e.preview && setHoverHire(true)} onMouseLeave={() => setHoverHire(false)}>
                            <NavItem entry={{ ...e, gradient: g.gradient }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3">
                  <div className="text-xs text-gray-500 mb-2">Profile Completion</div>
                  <div className="w-20 h-20 rounded-full bg-[conic-gradient(theme(colors.blue.500)_0_270deg,theme(colors.gray.200)_270deg_360deg)] grid place-items-center">
                    <div className="w-14 h-14 rounded-full bg-white grid place-items-center text-sm font-semibold text-gray-700">75%</div>
                  </div>
                  <button className="mt-4 w-full py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600">Upgrade to Pro
                    <span className="ml-2 text-[10px] align-middle bg-white/20 rounded px-1">50% off</span>
                  </button>
                </div>
              </div>
            </aside>
          </>
        )}

      <aside className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] w-72 bg-gradient-to-b from-gray-50 to-white border-r border-gray-100 shadow-inner">
        <div className="overflow-y-auto h-full p-3">
          <div className="flex items-center gap-3 p-3">
            <span className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white text-xl font-bold flex items-center justify-center">JD</span>
            <div>
              <div className="text-lg font-semibold text-slate-900">John Doe</div>
              <div className="text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">Premium Buyer</div>
            </div>
          </div>
          <div className="px-3 text-xs text-gray-500 flex items-center gap-4">
            <span>5 Active Requests</span>
            <span>12 Saved Vendors</span>
          </div>
          <div className="mt-4 space-y-6">
            {items.map((g) => (
              <div key={g.group}>
                <div className={`px-3 text-xs uppercase ${g.gradient ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600' : 'text-gray-500'}`}>{g.group}</div>
                <div className="mt-2 space-y-2">
                  {g.entries.map((e) => (
                    <div key={e.key} onMouseEnter={() => e.preview && setHoverHire(true)} onMouseLeave={() => setHoverHire(false)}>
                      <NavItem entry={{ ...e, gradient: g.gradient }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3">
            <div className="text-xs text-gray-500 mb-2">Profile Completion</div>
            <div className="w-20 h-20 rounded-full bg-[conic-gradient(theme(colors.blue.500)_0_270deg,theme(colors.gray.200)_270deg_360deg)] grid place-items-center">
              <div className="w-14 h-14 rounded-full bg-white grid place-items-center text-sm font-semibold text-gray-700">75%</div>
            </div>
            <button className="mt-4 w-full py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600">Upgrade to Pro
              <span className="ml-2 text-[10px] align-middle bg-white/20 rounded px-1">50% off</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

