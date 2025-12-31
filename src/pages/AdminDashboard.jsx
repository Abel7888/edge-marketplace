import { useEffect, useMemo, useState } from 'react'
import { Home, Building2, ClipboardList, Users, ShieldCheck, Briefcase, BarChart3, DollarSign, Mail, Settings, ChevronDown, Download, Plus, Search as SearchIcon, MoreHorizontal, ToggleLeft, ToggleRight, Star, CheckCircle2, AlertTriangle, CalendarClock } from 'lucide-react'
import vendorsData from '../data/vendors.js'
import { subscribeAllDemoRequests } from '../lib/firestoreRequests.js'

function fmt(n){ return n.toLocaleString() }

function usePersistentState(key, initial){
  const [val, setVal] = useState(()=>{
    try { const raw = localStorage.getItem(key); return raw? JSON.parse(raw) : initial } catch { return initial }
  })
  useEffect(()=>{ try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }, [key, val])
  return [val, setVal]
}

export default function AdminDashboard(){
  const [role, setRole] = usePersistentState('platform_role', 'admin')
  const [demoRequests, setDemoRequests] = useState([])

  // overview stats (mocked)
  const stats = {
    totalVendors: 270,
    totalUsers: 1247,
    buyers: 1180,
    vendors: 67,
    activeRequests: 42,
    pendingRequests: 18,
    inProgressRequests: 16,
    completedRequests: 8,
    vettingQueue: 7,
    monthlyRevenue: 45230,
    platformHealth: '99.8%',
    avgResponseHrs: 1.8,
    satisfaction: 4.7,
    reviews: 234,
  }

  const recent = [
    ['New vendor submitted: TechFlow AI', '5 min ago', 'Review'],
    ['Demo request: BuildSense AI ← John Doe', '15 min ago', 'View'],
    ['New user signup: jane@company.com', '1 hr ago', ''],
    ['Quote received: FlexBots → Sarah M.', '2 hrs ago', 'View'],
    ['Vendor verified: RoboWorks', '3 hrs ago', 'Admin: You'],
    ['Project posted: AI inventory system', '4 hrs ago', 'View'],
  ]

  const alerts = [
    { text: '3 vendors have not updated profiles in 90 days', level: 'warn' },
    { text: '2 users reported slow vendor response', level: 'warn' },
    { text: 'All systems operational', level: 'ok' },
  ]

  const [vmFilter, setVmFilter] = useState({ status: 'all', category: 'all', verified: 'all', q: '' })
  useEffect(()=>{
    const unsub = subscribeAllDemoRequests((list)=> setDemoRequests(list))
    return ()=> unsub && unsub()
  }, [])
  const vendorRows = useMemo(()=>{
    let list = vendorsData.slice(0, 25)
    if (vmFilter.category!=='all') list = list.filter(v => (v.category||'').toLowerCase().includes(vmFilter.category))
    if (vmFilter.verified!=='all') list = list.filter(v => !!v.isVerified === (vmFilter.verified==='verified'))
    if (vmFilter.q.trim()){
      const q = vmFilter.q.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(q) || (v.tags||[]).join(' ').toLowerCase().includes(q) || (v.shortDescription||'').toLowerCase().includes(q))
    }
    return list
  }, [vmFilter])

  const activity = useMemo(()=>{
    const gen = demoRequests.slice(0,5).map(d => {
      const label = `Demo request: ${d.formData?.vendorName || d.vendorId} ← ${d.formData?.requesterEmail || d.userId}`
      const when = (d.createdAt?.toDate ? d.createdAt.toDate() : new Date()).toLocaleTimeString()
      return [label, when, 'View']
    })
    return [...gen, ...recent].slice(0,6)
  }, [demoRequests])

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
      {/* Role switcher */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {['buyer','vendor','admin'].map(r => (
          <button key={r} onClick={()=> setRole(r)} className={`px-3 py-1.5 rounded-full text-sm border ${role===r? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`}>{r.charAt(0).toUpperCase()+r.slice(1)} View</button>
        ))}
      </div>
      {role!=='admin' && (
        <div className="mb-4 text-center text-sm">Role switched to <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{role}</span>. This demo page shows Admin features only.</div>
      )}

      {/* Admin layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="h-fit rounded-2xl border bg-white">
          <div className="p-3 text-xs uppercase text-gray-500">Admin</div>
          <nav className="px-2 pb-3 space-y-1 text-sm">
            <SideLink icon={<Home size={16}/>} text="Dashboard Overview" active />
            <SideLink icon={<Building2 size={16}/>} text="Vendor Management" />
            <SideLink icon={<ClipboardList size={16}/>} text="Request Management" />
            <SideLink icon={<CalendarClock size={16}/>} text="Demo Requests" badge={String(demoRequests.length||'')} />
            <SideLink icon={<Users size={16}/>} text="User Management" />
            <SideLink icon={<ShieldCheck size={16}/>} text="Vetting Queue" badge="7" />
            <SideLink icon={<Briefcase size={16}/>} text="Dev Firm Management" />
            <SideLink icon={<BarChart3 size={16}/>} text="Platform Analytics" />
            <SideLink icon={<DollarSign size={16}/>} text="Revenue & Billing" />
            <SideLink icon={<Mail size={16}/>} text="Communications" />
            <SideLink icon={<Settings size={16}/>} text="Platform Settings" />
          </nav>
        </aside>

        {/* Main */}
        <main>
          {/* Overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Metric title="Total Vendors" value={fmt(stats.totalVendors)} sub={'+15 this month'} action="Manage vendors →" />
            <Metric title="Total Users" value={fmt(stats.totalUsers)} sub={`Buyers: ${fmt(stats.buyers)} | Vendors: ${fmt(stats.vendors)}`} action="+89 this month" />
            <Metric title="Active Requests" value={fmt(stats.activeRequests)} sub={`Pending: ${stats.pendingRequests} • In Progress: ${stats.inProgressRequests} • Completed: ${stats.completedRequests}`} action="View all →" />
            <Metric title="Vetting Queue" value={fmt(stats.vettingQueue)} sub={'Avg wait: 2.3 days'} action="Review now →" />
            <Metric title="Monthly Revenue" value={`$${fmt(stats.monthlyRevenue)}`} sub={'+12% vs last month'} action="View breakdown →" />
            <Metric title="Platform Health" value={`${stats.platformHealth}`} sub={'Uptime'} action="View status →" />
            <Metric title="Avg Response Time" value={`${stats.avgResponseHrs} hrs`} sub={'-0.3h vs last month'} action="" />
            <Metric title="User Satisfaction" value={`${stats.satisfaction}/5`} sub={`Based on ${fmt(stats.reviews)} reviews`} action="View feedback →" />
          </div>

          {/* Activity & actions */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl border bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">Recent Activity (24h)</div>
              <div className="mt-2 divide-y">
                {activity.map((r,idx)=> (
                  <div key={idx} className="py-2 flex items-center justify-between text-sm">
                    <div>{r[0]}</div>
                    <div className="text-gray-500 flex items-center gap-3"><span>{r[1]}</span>{r[2] && <a href="#" className="text-blue-600">{r[2]}</a>}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">Quick Actions</div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <button className="h-10 rounded-lg bg-blue-600 text-white text-sm">Add New Vendor</button>
                <button className="h-10 rounded-lg border text-sm">Review Vetting Requests (7)</button>
                <button className="h-10 rounded-lg border text-sm">Approve Pending Vendors (3)</button>
                <button className="h-10 rounded-lg border text-sm">Export Platform Data</button>
                <button className="h-10 rounded-lg border text-sm">Send Announcement</button>
              </div>
              <div className="mt-4 text-sm">
                {alerts.map((a,idx)=> (
                  <div key={idx} className={`flex items-center gap-2 ${a.level==='warn'?'text-amber-700':'text-emerald-700'}`}>
                    {a.level==='warn' ? <AlertTriangle size={16}/> : <CheckCircle2 size={16}/>} {a.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vendor Management (stub) */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900">Vendor Management</div>
                <div className="text-sm text-gray-600">Manage vendor records, status, verification, and featuring</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">Add New Vendor</button>
                <button className="px-3 py-2 rounded-lg border text-sm">Import Vendors</button>
                <button className="px-3 py-2 rounded-lg border text-sm"><Download size={14}/> Export All</button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <select value={vmFilter.status} onChange={e=> setVmFilter(f=>({...f,status:e.target.value}))} className="border rounded-lg px-2 py-1">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="rejected">Rejected</option>
              </select>
              <select value={vmFilter.category} onChange={e=> setVmFilter(f=>({...f,category:e.target.value}))} className="border rounded-lg px-2 py-1">
                <option value="all">All Categories</option>
                <option value="proptech">PropTech</option>
                <option value="ai">AI</option>
                <option value="robotics">Robotics</option>
                <option value="iot">IoT</option>
              </select>
              <select value={vmFilter.verified} onChange={e=> setVmFilter(f=>({...f,verified:e.target.value}))} className="border rounded-lg px-2 py-1">
                <option value="all">All Vendors</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
              <div className="relative">
                <SearchIcon size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={vmFilter.q} onChange={e=> setVmFilter(f=>({...f,q:e.target.value}))} placeholder="Search vendors..." className="pl-7 pr-2 py-1 border rounded-lg" />
              </div>
            </div>

            <div className="mt-3 bg-white border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2"><input type="checkbox" /></th>
                    <th className="text-left px-3 py-2">Vendor</th>
                    <th className="text-left px-3 py-2">Status</th>
                    <th className="text-left px-3 py-2">Verified</th>
                    <th className="text-left px-3 py-2">Featured</th>
                    <th className="text-left px-3 py-2">Metrics</th>
                    <th className="text-left px-3 py-2">Last Updated</th>
                    <th className="text-left px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {vendorRows.map(v => (
                    <tr key={v.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2"><input type="checkbox" /></td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md grid place-items-center bg-gray-100 text-base">{v.logoEmoji || '🏢'}</div>
                          <div>
                            <div className="font-semibold text-slate-900">{v.name}</div>
                            <div className="text-xs text-gray-500">{v.category} • <span className="text-gray-400">ID:</span> {v.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Active</span></td>
                      <td className="px-3 py-2">
                        <Toggle defaultChecked={!!v.isVerified} />
                      </td>
                      <td className="px-3 py-2"><Toggle defaultChecked={!!v.isFeatured} /></td>
                      <td className="px-3 py-2 text-gray-700">
                        <div>Views: {fmt(v.metrics?.viewCount || 0)}</div>
                        <div>Demos: {fmt(v.metrics?.demoRequests || 0)} • Quotes: {fmt(v.metrics?.quoteRequests || 0)}</div>
                      </td>
                      <td className="px-3 py-2 text-gray-600">{new Date(v.lastUpdated || v.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="px-3 py-2 text-right">
                        <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-gray-100"><MoreHorizontal size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Demo Requests */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900">Demo Requests</div>
                <div className="text-sm text-gray-600">Newly submitted demo requests from buyers</div>
              </div>
            </div>
            <div className="mt-3 bg-white border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2">Created</th>
                    <th className="text-left px-3 py-2">Vendor</th>
                    <th className="text-left px-3 py-2">Requester</th>
                    <th className="text-left px-3 py-2">Urgency</th>
                    <th className="text-left px-3 py-2">Preferred Slots</th>
                    <th className="text-left px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {demoRequests.map(req => (
                    <tr key={req.id} className="border-t">
                      <td className="px-3 py-2">{req.createdAt?.toDate? req.createdAt.toDate().toLocaleString() : ''}</td>
                      <td className="px-3 py-2">{req.formData?.vendorName || req.vendorId}</td>
                      <td className="px-3 py-2">{req.formData?.requesterEmail || req.userId}</td>
                      <td className="px-3 py-2">{req.formData?.urgency || '-'}</td>
                      <td className="px-3 py-2">{(req.formData?.preferredSlots||[]).map((s,i)=> `${s.date} ${s.start}-${s.end}`).join('; ')}</td>
                      <td className="px-3 py-2"><span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{req.status||'pending'}</span></td>
                    </tr>
                  ))}
                  {demoRequests.length===0 && (
                    <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">No demo requests yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function SideLink({ icon, text, badge, active, children }){
  return (
    <a className={`flex items-center gap-2 px-3 py-2 rounded-lg ${active? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`} href="#">
      <span>{icon}</span>
      <span className="flex-1">{text}</span>
      {badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">{badge}</span>}
      {children}
    </a>
  )
}

function Metric({ title, value, sub, action }){
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-emerald-700">{sub}</div>
      {action && <div className="text-xs text-blue-600 mt-1">{action}</div>}
    </div>
  )
}

function Toggle({ defaultChecked }){
  const [on, setOn] = useState(!!defaultChecked)
  return (
    <button onClick={()=> setOn(v=>!v)} className={`inline-flex items-center w-10 h-5 rounded-full ${on? 'bg-blue-600' : 'bg-gray-300'}`} aria-pressed={on}>
      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition ${on? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  )
}
