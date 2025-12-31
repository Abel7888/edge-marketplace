'use client'


import { useEffect, useMemo, useState } from 'react'
import { FileText, Clock, MessageSquare, CheckCircle, ChevronDown, Search as SearchIcon, MoreHorizontal, Check, X, Download } from 'lucide-react'

function formatDate(dt) {
  const d = new Date(dt)
  return d.toLocaleString()
}

function timeAgo(dt) {
  const diff = (Date.now() - new Date(dt).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

function genMockRequests(count = 24) {
  const vendors = [
    { id: 'v1', name: 'BuildSense AI', logo: '🏢' },
    { id: 'v2', name: 'FinFlow', logo: '💰' },
    { id: 'v3', name: 'SiteVision', logo: '🏗️' },
    { id: 'v4', name: 'CarePulse', logo: '💊' },
    { id: 'v5', name: 'RoboWorks', logo: '🦾' },
    { id: 'v6', name: 'CogniFlow', logo: '🤖' },
  ]
  const types = ['demo','quote','vet']
  const statuses = ['pending','contacted','scheduled','quote_received','completed','declined']
  const priorities = ['high','medium','low']
  const arr = []
  for (let i = 0; i < count; i++) {
    const v = vendors[Math.floor(Math.random()*vendors.length)]
    const type = types[Math.floor(Math.random()*types.length)]
    const status = statuses[Math.floor(Math.random()*statuses.length)]
    const priority = priorities[Math.floor(Math.random()*priorities.length)]
    const createdAt = Date.now() - Math.floor(Math.random()*90)*24*3600*1000 - Math.floor(Math.random()*86400000)
    const scheduled = status==='scheduled' ? {
      type: 'demo',
      date: new Date(Date.now() + Math.floor(Math.random()*7)*24*3600*1000 + 14*3600*1000).toISOString(),
      duration: 45,
      joinLink: '#',
    } : null
    arr.push({
      id: `req-${i+1}`,
      userId: 'user-1',
      vendorId: v.id,
      vendorName: v.name,
      vendorLogo: v.logo,
      type,
      status,
      priority,
      formData: { name: 'John Doe', email: 'john@company.com', company: 'Acme Corp' },
      timeline: [
        { date: new Date(createdAt).toISOString(), action: 'submitted', by: 'user' },
      ],
      messages: [],
      files: [],
      scheduledEvent: scheduled,
      notes: '',
      tags: [],
      metrics: {
        responseTime: [45, 120, 1800][Math.floor(Math.random()*3)],
        messagesCount: Math.floor(Math.random()*5),
        vendorRating: status==='completed' ? (4 + Math.random()).toFixed(1) : null,
      },
      createdAt: new Date(createdAt).toISOString(),
      updatedAt: new Date(createdAt + Math.floor(Math.random()*5)*3600*1000).toISOString(),
    })
  }
  return arr
}

export default function RequestsDashboard() {
  const [requests, setRequests] = useState(() => genMockRequests(24))
  const [filteredRequests, setFilteredRequests] = useState([])
  const [selectedRequests, setSelectedRequests] = useState([])
  const [viewMode, setViewMode] = useState('list')
  const [filters, setFilters] = useState({ type: 'all', status: 'all', dateRange: 'last30days', vendor: null, priority: 'all' })
  const [sortBy, setSortBy] = useState('most-recent')
  const [expandedRow, setExpandedRow] = useState(null)
  const [query, setQuery] = useState('')

  function filterByDateRange(list, range) {
    const now = Date.now()
    const day = 24*3600*1000
    let from = 0
    if (range==='last7days') from = now - 7*day
    else if (range==='last30days' || range==='all') from = now - 30*day
    else if (range==='last3months') from = now - 90*day
    return list.filter(r => new Date(r.createdAt).getTime() >= from)
  }
  function sortRequests(list, sort) {
    const arr = [...list]
    if (sort==='most-recent') arr.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))
    else if (sort==='oldest') arr.sort((a,b)=> new Date(a.createdAt)-new Date(b.createdAt))
    else if (sort==='priority') { const p={'high':0,'medium':1,'low':2}; arr.sort((a,b)=> p[a.priority]-p[b.priority]) }
    else if (sort==='status-pending') { const order=['pending','contacted','scheduled','quote_received','completed','declined']; arr.sort((a,b)=> order.indexOf(a.status)-order.indexOf(b.status)) }
    else if (sort==='vendor-az') arr.sort((a,b)=> a.vendorName.localeCompare(b.vendorName))
    return arr
  }

  useEffect(()=>{
    let list = [...requests]
    if (filters.type !== 'all') list = list.filter(r => r.type === filters.type)
    if (filters.status !== 'all') list = list.filter(r => r.status === filters.status)
    list = filterByDateRange(list, filters.dateRange)
    if (filters.vendor) list = list.filter(r => r.vendorId === filters.vendor)
    if (filters.priority !== 'all') list = list.filter(r => r.priority === filters.priority)
    if (query.trim()) list = list.filter(r => r.vendorName.toLowerCase().includes(query.toLowerCase()) || r.id.toLowerCase().includes(query.toLowerCase()))
    list = sortRequests(list, sortBy)
    setFilteredRequests(list)
  }, [requests, filters, sortBy, query])

  const stats = useMemo(()=>{
    const total = requests.length
    const pending = requests.filter(r=> r.status==='pending').length
    const inProgress = requests.filter(r=> ['contacted','scheduled','quote_received'].includes(r.status)).length
    const completed = requests.filter(r=> r.status==='completed').length
    return { total, pending, inProgress, completed }
  }, [requests])

  const allSelected = selectedRequests.length>0 && selectedRequests.length === filteredRequests.length
  function toggleSelectAll(e){ if (e.target.checked) setSelectedRequests(filteredRequests.map(r=> r.id)); else setSelectedRequests([]) }
  function toggleSelect(id){ setSelectedRequests(prev => prev.includes(id)? prev.filter(x=>x!==id) : [...prev, id]) }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>Home <span className="mx-1">›</span> My Requests</div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"><Download size={16}/> Export All</button>
        </div>
      </div>
      <div className="mt-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Requests</h1>
        <p className="text-gray-600">Track all your demo, quote, and vetting requests</p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Requests" value={stats.total} icon={<FileText className="text-blue-600" size={18}/>} sub="+5 this month" />
        <StatCard title="Pending" value={stats.pending} icon={<Clock className="text-amber-500" size={18}/>} sub="Awaiting response" />
        <StatCard title="In Progress" value={stats.inProgress} icon={<MessageSquare className="text-blue-600" size={18}/>} sub="3 demos scheduled" />
        <StatCard title="Completed" value={stats.completed} icon={<CheckCircle className="text-emerald-600" size={18}/>} sub="87% satisfaction" />
      </div>

      {/* Filters & Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            ['all', `All (${stats.total})`],
            ['demo', `Demo (${requests.filter(r=>r.type==='demo').length})`],
            ['quote', `Quote (${requests.filter(r=>r.type==='quote').length})`],
            ['vet', `Vetting (${requests.filter(r=>r.type==='vet').length})`],
          ].map(([t,label]) => (
            <button key={t} onClick={()=> setFilters(f=>({...f, type: t}))} className={`px-3 py-1.5 rounded-full border text-sm ${filters.type===t? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{label}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={filters.status} onChange={e=> setFilters(f=>({...f,status:e.target.value}))} className="text-sm border rounded-lg px-2 py-1">
            <option value="all">All Statuses</option>
            <option value="pending">🟡 Pending</option>
            <option value="contacted">🔵 Contacted</option>
            <option value="scheduled">🟢 Scheduled</option>
            <option value="quote_received">🟣 Quote Received</option>
            <option value="completed">✅ Completed</option>
            <option value="declined">❌ Declined</option>
          </select>
          <select value={filters.dateRange} onChange={e=> setFilters(f=>({...f,dateRange:e.target.value}))} className="text-sm border rounded-lg px-2 py-1">
            <option value="last7days">Last 7 days</option>
            <option value="last30days">Last 30 days</option>
            <option value="last3months">Last 3 months</option>
            <option value="all">All time</option>
          </select>
          <select value={filters.priority} onChange={e=> setFilters(f=>({...f,priority:e.target.value}))} className="text-sm border rounded-lg px-2 py-1">
            <option value="all">All priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={e=> setQuery(e.target.value)} placeholder="Search requests..." className="pl-8 pr-3 py-1.5 border rounded-lg text-sm" />
            </div>
            <select value={sortBy} onChange={e=> setSortBy(e.target.value)} className="text-sm border rounded-lg px-2 py-1">
              <option value="most-recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority: High to Low</option>
              <option value="status-pending">Status: Pending First</option>
              <option value="vendor-az">Vendor: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* List view */}
      {viewMode==='list' && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[32px_1.5fr_1fr_1fr_1fr_40px] items-center px-4 py-3 border-b text-xs text-gray-500">
            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
            <div>Request</div>
            <div>Status</div>
            <div>Last Activity</div>
            <div>Response Time</div>
            <div></div>
          </div>
          <div>
            {filteredRequests.map(r => (
              <div key={r.id} className="border-b last:border-b-0">
                <div className="grid grid-cols-[32px_1.5fr_1fr_1fr_1fr_40px] items-center px-4 py-3 hover:bg-gray-50">
                  <input type="checkbox" checked={selectedRequests.includes(r.id)} onChange={()=> toggleSelect(r.id)} />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg grid place-items-center bg-gray-100 text-base">{r.vendorLogo}</div>
                      <div className="font-semibold text-slate-900">{r.vendorName}</div>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${r.type==='demo'?'bg-blue-100 text-blue-700':r.type==='quote'?'bg-emerald-100 text-emerald-700':'bg-purple-100 text-purple-700'}`}>{r.type.toUpperCase()}</span>
                      <span className="inline-flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${r.priority==='high'?'bg-red-500':r.priority==='medium'?'bg-amber-500':'bg-emerald-500'}`} />
                        <span className="text-gray-600">{r.priority}</span>
                      </span>
                      <span className="text-gray-500">Submitted {formatDate(r.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={r.status} scheduledEvent={r.scheduledEvent} />
                  </div>
                  <div className="text-sm text-gray-700">
                    {r.status==='contacted' ? `Vendor replied ${timeAgo(r.updatedAt)}` : r.status==='scheduled' ? `Demo scheduled ${formatDate(r.scheduledEvent?.date)}` : `Updated ${timeAgo(r.updatedAt)}`}
                  </div>
                  <div className="text-sm">
                    <ResponseBadge minutes={r.metrics.responseTime} />
                  </div>
                  <div className="flex items-center justify-end">
                    <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-gray-100"><MoreHorizontal size={16}/></button>
                  </div>
                </div>
                {expandedRow===r.id && (
                  <div className="px-4 py-3 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="font-semibold mb-1">Request Details</div>
                        <div className="text-sm text-gray-700">Name: {r.formData.name}</div>
                        <div className="text-sm text-gray-700">Email: {r.formData.email}</div>
                        <div className="text-sm text-gray-700">Company: {r.formData.company}</div>
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Timeline</div>
                        <div className="text-sm text-gray-700">Submitted: {formatDate(r.createdAt)}</div>
                        {r.status!=='pending' && <div className="text-sm text-gray-700">Last activity: {formatDate(r.updatedAt)}</div>}
                        {r.scheduledEvent && (
                          <div className="text-sm text-gray-700">Scheduled: {formatDate(r.scheduledEvent.date)}</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Vendor</div>
                        <div className="text-sm text-gray-700">{r.vendorName}</div>
                        <a href="#" className="text-sm text-blue-600">View vendor profile</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon, sub }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gray-50 grid place-items-center">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-emerald-600">{sub}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status, scheduledEvent }) {
  const map = {
    pending: ['bg-amber-100 text-amber-700','🟡 Pending','Waiting for vendor response'],
    contacted: ['bg-blue-100 text-blue-700','🔵 Contacted','Vendor replied'],
    scheduled: ['bg-emerald-100 text-emerald-700','🟢 Scheduled', scheduledEvent?`Demo: ${new Date(scheduledEvent.date).toLocaleString()}`:'Scheduled'],
    quote_received: ['bg-purple-100 text-purple-700','🟣 Quote Received','View quote'],
    completed: ['bg-emerald-100 text-emerald-700','✅ Completed','Closed'],
    declined: ['bg-red-100 text-red-700','❌ Declined',''],
  }
  const [bg, label, sub] = map[status] || map.pending
  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg text-xs ${bg}`} title={sub}>
      <span>{label}</span>
      {status==='quote_received' && <a href="#" className="underline">View quote</a>}
      {status==='scheduled' && <a href="#" className="underline">Add to calendar</a>}
    </div>
  )
}

function ResponseBadge({ minutes }) {
  if (minutes == null) return <span className="text-gray-500 text-sm">No response yet</span>
  if (minutes <= 120) return <span className="text-emerald-700 text-sm">&lt; 2 hours</span>
  if (minutes <= 1440) return <span className="text-blue-700 text-sm">&lt; 24 hours</span>
  if (minutes <= 2880) return <span className="text-amber-700 text-sm">1-2 days</span>
  return <span className="text-red-700 text-sm">&gt; 2 days</span>
}

