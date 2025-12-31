'use client'


import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

import { useRouter } from 'next/navigation'
import {
  Bell,
  Search,
  User,
  ChevronDown,
  ChevronRight,
  Star,
  Calendar,
  FileText,
  BarChart2,
  Paperclip,
  Mic,
  Send,
} from 'lucide-react'

const RAG_ENDPOINT = 'https://us-central1-marketplace-3d57c.cloudfunctions.net/interactionQuery'

function TopNav({ userDisplayName, userInitials }){
  return (
    <header className="h-[72px] w-full flex items-center justify-between px-6 border-b border-gray-200 bg-white shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white grid place-items-center text-lg font-bold">AI</div>
        <div className="flex items-center gap-3">
          <div className="text-[20px] font-semibold text-gray-800">MarketplaceAI</div>
          <div className="w-px h-8 bg-gray-200" />
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-[480px] relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search vendors, solutions, or ask anything..."
            className="w-full h-11 rounded-xl bg-gray-50 border border-gray-200 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-full grid place-items-center text-gray-600 hover:bg-gray-100 transition" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white grid place-items-center font-semibold">3</span>
        </button>
        <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 transition" aria-label="User menu">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center text-sm font-semibold">
            {userInitials}
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>
    </header>
  )
}

function SaveToast({ vendorName, added }){
  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="max-w-sm rounded-xl bg-slate-900 text-white shadow-xl px-4 py-3 flex items-start gap-3 animate-[slideInRight_0.25s_ease-out]">
        <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500 grid place-items-center text-white text-xs">✓</div>
        <div>
          <div className="text-sm font-semibold">
            {added? `${vendorName} saved to your workspace` : `${vendorName} removed from your workspace`}
          </div>
          <button className="mt-1 text-[12px] text-indigo-300 hover:text-indigo-200 underline-offset-2 hover:underline">
            View Workspace →
          </button>
        </div>
      </div>
    </div>
  )
}

function SidebarSection({ title, children }){
  return (
    <div className="mt-6">
      <div className="px-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function SidebarGroup({ icon:Icon, label, items }){
  const [open, setOpen] = useState(true)
  const router = useRouter()
  return (
    <div className="px-2">
      <button
        onClick={()=> setOpen(v=> !v)}
        className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-gray-600" />
          <span>{label}</span>
        </div>
        {open? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-400" />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="mt-1 pl-8 pr-2 space-y-0.5">
          {items.map(item=> {
            const labelText = typeof item === 'string'? item : item.label
            const path = typeof item === 'string'? undefined : item.path
            const handleClick = ()=>{ if (path) navigate(path) }
            return (
              <button
                key={labelText}
                onClick={handleClick}
                className="w-full flex items-center justify-between h-9 px-2 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 transition"
              >
                <span>{labelText}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SidebarQuickButton({ label, color }){
  const colorMap = {
    compare: 'border-indigo-500 text-indigo-700 hover:bg-indigo-500 hover:text-white',
    hire: 'border-emerald-500 text-emerald-700 hover:bg-emerald-500 hover:text-white',
    request: 'border-violet-500 text-violet-700 hover:bg-violet-500 hover:text-white',
  }
  return (
    <button
      className={`w-full h-12 mt-3 rounded-xl border bg-white flex items-center justify-center text-sm font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition ${colorMap[color]}`}
    >
      {label}
    </button>
  )
}

function Sidebar({ savedCount, userDisplayName, userInitials }){
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[280px] h-full border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white">
      {/* Profile */}
      <div className="px-4 pt-5 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white grid place-items-center text-sm font-semibold">{userInitials}</div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{userDisplayName}</div>
            <div className="text-[12px] text-indigo-600 flex items-center gap-1">
              <span className="text-[11px]">🏆</span>
              <span>Enterprise Account</span>
            </div>
            <div className="text-[11px] text-emerald-500 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Active now</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Vendor Marketplace */}
        <SidebarSection title="Vendor Marketplace">
          <SidebarGroup
            icon={BarChart2}
            label="Industries"
            items={[
              { label:'Real Estate', path:'/discover/proptech' },
              { label:'Finance', path:'/discover/fintech' },
              { label:'Construction', path:'/discover/contech' },
              { label:'Medical Device', path:'/discover/medtech' },
              { label:'Healthcare', path:'/discover/healthtech' },
              { label:'Supply Chain', path:'/discover/supplychain' },
            ]}
          />
          <SidebarGroup
            icon={FileText}
            label="Software"
            items={[
              { label:'Artificial Intelligence', path:'/discover/ai' },
              { label:'Machine Learning', path:'/discover/ml' },
              { label:'Internet of Things', path:'/discover/iot' },
              { label:'Blockchain & Web3', path:'/discover/iot' },
              { label:'AR/VR', path:'/discover/arvr' },
              { label:'Digital Twin', path:'/discover/digital-twin' },
              { label:'Edge Computing', path:'/discover/edge-computing' },
            ]}
          />
          <SidebarGroup
            icon={Calendar}
            label="Hardware"
            items={[
              { label:'Computing & Processing', path:'/discover/semiconductors' },
              { label:'Networking & Connectivity', path:'/discover/networking' },
              { label:'Automation & Robotics', path:'/discover/automation-robotics' },
              { label:'Power & Infrastructure', path:'/discover/power-infrastructure' },
              { label:'3D Printing', path:'/discover/3d-printing' },
              { label:'Quantum Computing', path:'/discover/quantum' },
              { label:'Battery Innovation' },
            ]}
          />
        </SidebarSection>

        {/* Services & Solutions */}
        <SidebarSection title="Services & Solutions">
          <div className="px-2 space-y-1">
            <button
              onClick={()=> router.push('/discover/certifications')}
              className="w-full h-9 flex items-center gap-2 px-2 rounded-md text-sm text-gray-800 hover:bg-gray-100 transition"
            >
              <span className="text-[15px]">🎓</span>
              <span>AI Governance & Training</span>
            </button>
            <button
              onClick={()=> router.push('/hire')}
              className="w-full h-9 flex items-center gap-2 px-2 rounded-md text-sm text-gray-800 hover:bg-gray-100 transition"
            >
              <span className="text-[15px]">👥</span>
              <span>Hire Development Team</span>
            </button>
            <button
              onClick={()=> router.push('/find-talent')}
              className="w-full h-9 flex items-center gap-2 px-2 rounded-md text-sm text-gray-800 hover:bg-gray-100 transition"
            >
              <span className="text-[15px]">🔍</span>
              <span>Find Talent</span>
            </button>
          </div>
        </SidebarSection>

        {/* My Workspace */}
        <SidebarSection title="My Workspace">
          <div className="px-2 space-y-1 text-[13px]">
            <button className="w-full h-9 flex items-center justify-between px-2 rounded-md text-gray-800 hover:bg-gray-100 transition">
              <span className="flex items-center gap-2"><span>⭐</span>Saved Vendors</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-[11px] font-semibold text-white">{savedCount}</span>
            </button>
            <button className="w-full h-9 flex items-center justify-between px-2 rounded-md text-gray-800 hover:bg-gray-100 transition">
              <span className="flex items-center gap-2"><span>📋</span>My Requests</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-[11px] font-semibold text-white">3</span>
            </button>
            <button className="w-full h-9 flex items-center justify-between px-2 rounded-md text-gray-800 hover:bg-gray-100 transition">
              <span className="flex items-center gap-2"><span>📅</span>Scheduled Demos</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-[11px] font-semibold text-white">2</span>
            </button>
            <button className="w-full h-9 flex items-center justify-between px-2 rounded-md text-gray-800 hover:bg-gray-100 transition">
              <span className="flex items-center gap-2"><span>📊</span>Active Comparisons</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-[11px] font-semibold text-white">1</span>
            </button>
            <button className="w-full h-9 flex items-center gap-2 px-2 rounded-md text-gray-800 hover:bg-gray-100 transition">
              <span>🕐</span>
              <span>Recent Activity</span>
            </button>
          </div>
        </SidebarSection>

      </div>
    </aside>
  )
}

function TypingIndicator(){
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white grid place-items-center text-xs font-semibold">AI</div>
      <div className="px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay:'0ms' }} />
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay:'120ms' }} />
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay:'240ms' }} />
      </div>
    </div>
  )
}

function UserBubble({ content, timestamp }){
  return (
    <div className="w-full flex flex-col items-end mt-3">
      <div className="max-w-[70%] bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-3 rounded-[18px_18px_4px_18px] shadow-lg text-[15px] leading-relaxed animate-[slideInRight_0.3s_ease-out]">
        {content}
      </div>
      {timestamp && (
        <div className="mt-1 text-[12px] text-gray-400">{timestamp}</div>
      )}
    </div>
  )
}

function AiBubble({ content, timestamp, children }){
  return (
    <div className="w-full flex mt-4">
      <div className="relative max-w-[84%]">
        <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white grid place-items-center text-xs font-semibold">AI</div>
        <div className="ml-2 bg-white border border-gray-200 rounded-[4px_18px_18px_18px] shadow-md px-5 py-4 text-[15px] leading-relaxed text-gray-900 animate-[slideInLeft_0.4s_ease-out]">
          <div>{content}</div>
          {children}
        </div>
        {timestamp && (
          <div className="mt-1 ml-2 text-[12px] text-gray-400">{timestamp}</div>
        )}
      </div>
    </div>
  )
}

function SponsoredVendorCard({ isSaved, onToggleSave }){
  return (
    <div className="mt-4 w-full max-w-[1100px] bg-gradient-to-br from-amber-50 to-white border-2 border-amber-300 rounded-2xl p-6 shadow-[0_6px_16px_rgba(217,119,6,0.12)] hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(217,119,6,0.2)] transition">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded-md border border-amber-300 bg-amber-50 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700 flex items-center gap-1">
            <span>✨</span>
            <span>Sponsored Partner</span>
          </div>
        </div>
        <button
          onClick={onToggleSave}
          className={`w-9 h-9 rounded-full grid place-items-center transition ${isSaved? 'bg-amber-100 text-amber-400 scale-110' : 'bg-amber-50 text-amber-300 hover:text-amber-500 hover:bg-amber-100'}`}
          aria-label={isSaved? 'Unsave vendor' : 'Save vendor'}
        >
          <Star size={20} fill={isSaved? '#FBBF24' : 'none'} stroke={isSaved? '#FBBF24' : 'currentColor'} />
        </button>
      </div>

      <div className="mt-4 flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border-2 border-gray-200 bg-white grid place-items-center text-2xl">💳</div>
          <div>
            <div className="text-lg font-semibold text-gray-900">FinTech AI Solutions</div>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
              <div className="flex items-center text-amber-400">
                <Star size={16} fill="#FBBF24" stroke="#FBBF24" />
                <Star size={16} fill="#FBBF24" stroke="#FBBF24" />
                <Star size={16} fill="#FBBF24" stroke="#FBBF24" />
                <Star size={16} fill="#FBBF24" stroke="#FBBF24" />
                <Star size={16} fill="#FBBF24" stroke="#FBBF24" />
              </div>
              <span className="font-semibold text-gray-800">4.8/5</span>
              <button className="text-xs text-gray-500 hover:text-gray-700 hover:underline">(247 reviews)</button>
            </div>
            <div className="mt-1 flex flex-wrap gap-1 text-[12px]">
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium flex items-center gap-1">
                <span>🏆</span>
                <span>Top Rated</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">Finance</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">Artificial Intelligence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-[15px] text-gray-800 leading-relaxed">
        Leading AI-powered financial forecasting platform with <span className="font-semibold">95% prediction accuracy</span>.
        Trusted by <span className="font-semibold">250+ Fortune 500 companies</span> for real-time risk and revenue forecasting.
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-gray-800">
          <span className="text-emerald-500">✓</span>
          <span>Real-time predictions</span>
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-gray-800">
          <span className="text-emerald-500">✓</span>
          <span>Risk analysis</span>
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-gray-800">
          <span className="text-emerald-500">✓</span>
          <span>API integration</span>
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-gray-800">
          <span className="text-emerald-500">✓</span>
          <span>99.9% uptime</span>
        </div>
      </div>

      <div className="mt-4 px-4 py-2 rounded-lg bg-gray-50 flex flex-wrap gap-4 text-[13px] text-gray-700">
        <span className="flex items-center gap-2"><BarChart2 size={15} className="text-gray-500" /> 250+ implementations</span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-2"><Star size={15} className="text-amber-400" /> #1 in Finance</span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-2"><Calendar size={15} className="text-indigo-500" /> ⚡ Live Demo Available</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <button className="inline-flex items-center gap-2 px-4 h-11 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium shadow-md hover:shadow-lg hover:brightness-110 transform hover:-translate-y-0.5 transition">
          <Calendar size={18} />
          <span>Schedule Demo</span>
        </button>
        <button className="inline-flex items-center gap-2 px-4 h-11 rounded-full border border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50 transition">
          <FileText size={16} />
          <span>Request RFI</span>
        </button>
        <button className="inline-flex items-center gap-2 px-4 h-11 rounded-full border border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50 transition">
          <BarChart2 size={16} />
          <span>View Case Studies</span>
        </button>
        <button className="inline-flex items-center gap-1 px-2 h-11 text-indigo-600 hover:text-indigo-700">
          <span>See Full Profile</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </div>
  )
}

function RegularVendorCard({ name, rating, reviews, tags, description, isSaved, onToggleSave }){
  return (
    <div className="mt-4 w-full max-w-[1100px] bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border border-gray-200 bg-gray-50 grid place-items-center text-xl">📊</div>
          <div>
            <div className="text-[17px] font-semibold text-gray-900">{name}</div>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
              <div className="flex items-center text-amber-400">
                <Star size={15} fill="#FBBF24" stroke="#FBBF24" />
                <Star size={15} fill="#FBBF24" stroke="#FBBF24" />
                <Star size={15} fill="#FBBF24" stroke="#FBBF24" />
                <Star size={15} fill="#FBBF24" stroke="#FBBF24" />
                <Star size={15} fill="#FBBF24" stroke="#FBBF24" />
              </div>
              <span className="font-semibold text-gray-800">{rating}</span>
              <button className="text-xs text-gray-500 hover:text-gray-700 hover:underline">({reviews} reviews)</button>
            </div>
            <div className="mt-1 flex flex-wrap gap-1 text-[12px]">
              {tags.map(t=> (
                <span key={t} className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onToggleSave}
          className={`w-8 h-8 rounded-full grid place-items-center transition ${isSaved? 'bg-amber-50 text-amber-400 scale-110' : 'bg-gray-50 text-gray-400 hover:text-amber-400 hover:bg-amber-50'}`}
          aria-label={isSaved? 'Unsave vendor' : 'Save vendor'}
        >
          <Star size={18} fill={isSaved? '#FBBF24' : 'none'} stroke={isSaved? '#FBBF24' : 'currentColor'} />
        </button>
      </div>

      <div className="mt-3 text-[15px] text-gray-800 leading-relaxed">
        {description}
      </div>

      <div className="mt-4 px-4 py-2 rounded-lg bg-gray-50 flex flex-wrap gap-4 text-[13px] text-gray-700">
        <span className="flex items-center gap-2"><BarChart2 size={15} className="text-gray-500" /> 180+ clients</span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-2"><Star size={15} className="text-amber-400" /> 4.6 rating</span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-2"><Calendar size={15} className="text-indigo-500" /> 2-week deployment</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <button className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium shadow-md hover:shadow-lg hover:brightness-110 transform hover:-translate-y-0.5 transition">
          <Calendar size={16} />
          <span>Schedule Demo</span>
        </button>
        <button className="inline-flex items-center gap-2 px-4 h-10 rounded-full border border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50 transition">
          <FileText size={15} />
          <span>Request RFI</span>
        </button>
        <button className="inline-flex items-center gap-2 px-4 h-10 rounded-full border border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50 transition">
          <BarChart2 size={15} />
          <span>Case Studies</span>
        </button>
        <button className="inline-flex items-center gap-1 px-2 h-10 text-indigo-600 hover:text-indigo-700">
          <span>Details</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </div>
  )
}

function QuickActionPill({ label, onClick }){
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white text-sm text-gray-800 shadow-sm hover:border-indigo-400 hover:bg-indigo-50 hover:-translate-y-0.5 transform transition"
    >
      <span>{label}</span>
    </button>
  )
}

function PopularQuestionCard({ icon, label, onClick }){
  return (
    <button
      onClick={onClick}
      className="w-full max-w-[320px] text-left bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-[15px] text-gray-800">{label}</span>
      </div>
    </button>
  )
}

function ChatInput({ value, onChange, onSend }){
  const handleKeyDown = (e)=>{
    if (e.key === 'Enter' && !e.shiftKey){
      e.preventDefault()
      onSend()
    }
  }

  const canSend = value.trim().length>0

  return (
    <div className="border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-4">
        <div className="flex items-end gap-3">
          <button className="w-10 h-10 rounded-full grid place-items-center text-gray-500 hover:bg-gray-100 transition" aria-label="Attach file">
            <Paperclip size={18} />
          </button>
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={value}
              onChange={(e)=> onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full max-h-[200px] rounded-2xl bg-gray-50 border-2 border-gray-200 px-4 pr-24 py-3 text-[15px] text-gray-900 resize-none focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
            <div className="absolute inset-y-0 right-3 flex items-center gap-2">
              <button className="w-9 h-9 rounded-full grid place-items-center text-gray-500 hover:bg-gray-100 transition" aria-label="Voice input">
                <Mic size={18} />
              </button>
              <button
                aria-label="Send"
                disabled={!canSend}
                onClick={onSend}
                className={`w-10 h-10 rounded-full grid place-items-center text-white transition transform ${canSend? 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:scale-105 hover:shadow-md' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Interaction(){
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [savedVendors, setSavedVendors] = useState([])
  const [toast, setToast] = useState(null)
  const { currentUser } = useAuth()
  const scrollRef = useRef(null)

  const showWelcome = messages.length === 0
  const savedCount = savedVendors.length

  useEffect(()=>{
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isThinking])

  const sendMessage = async (text)=>{
    const content = (text ?? input).trim()
    if (!content || isThinking) return

    const now = new Date().toLocaleTimeString([], { hour:'numeric', minute:'2-digit' })
    const userMsg = { id: Date.now(), type:'user', content, timestamp: now }
    setMessages(prev=> [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    try {
      const res = await fetch(RAG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          filters: {
            categoryGroup: 'industries',
          },
        }),
      })

      const data = await res.json()
      const answer = data?.answer || 'I could not find any relevant vendors yet, but I will improve as more data is added.'

      const aiIntro = {
        id: Date.now() + 1,
        type: 'assistant',
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour:'numeric', minute:'2-digit' }),
      }

      if (Array.isArray(data?.vendors)){
        console.log('RAG vendors result:', data.vendors)
      }

      setMessages(prev=> [...prev, aiIntro])
    } catch (err){
      console.error('RAG request failed', err)
      const aiError = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Something went wrong reaching the AI assistant. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour:'numeric', minute:'2-digit' }),
      }
      setMessages(prev=> [...prev, aiError])
    } finally {
      setIsThinking(false)
    }
  }

  const handleQuickQuestion = (q)=>{
    setInput(q)
    sendMessage(q)
  }

  const resetToDefault = ()=>{
    setMessages([])
    setInput('')
    setIsThinking(false)
  }

  const deriveUserDisplay = ()=>{
    if (currentUser){
      const name = currentUser.displayName || currentUser.email || 'User'
      return name
    }
    return 'Guest User'
  }

  const deriveInitials = ()=>{
    if (currentUser){
      const base = currentUser.displayName || currentUser.email || 'User'
      const parts = base.split('@')[0].split(' ').filter(Boolean)
      if (parts.length === 1){
        return parts[0].slice(0,2).toUpperCase()
      }
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return 'GU'
  }

  const userDisplayName = deriveUserDisplay()
  const userInitials = deriveInitials()

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <TopNav userDisplayName={userDisplayName} userInitials={userInitials} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar savedCount={savedCount} userDisplayName={userDisplayName} userInitials={userInitials} />

        <main className="flex-1 flex flex-col">
          {toast && <SaveToast vendorName={toast.vendorName} added={toast.added} />}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
            <div className="max-w-[1100px] mx-auto">
              {/* Welcome state */}
              {showWelcome && (
                <div className="mt-16 flex flex-col items-center text-center">
                  <div className="text-[32px] md:text-[36px] font-bold text-gray-900 animate-fade-in">
                    Welcome back, {userDisplayName}! <span className="inline-block">👋</span>
                  </div>
                  <div className="mt-3 text-[17px] text-gray-600 max-w-xl">
                    How can I help you discover the perfect solutions today?
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <QuickActionPill label="🤖 Find AI Vendors" onClick={()=> handleQuickQuestion('Find AI vendors for my use case')} />
                    <QuickActionPill label="👥 Hire Dev Teams" onClick={()=> handleQuickQuestion('I want to hire a development team')} />
                    <QuickActionPill label="🔍 Compare Solutions" onClick={()=> handleQuickQuestion('Compare vendors for my requirements')} />
                    <QuickActionPill label="⭐ Get Advice" onClick={()=> handleQuickQuestion('Help me choose between multiple vendors')} />
                  </div>

                  <div className="mt-10 w-full max-w-3xl">
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-3 text-left">Popular questions</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                      <PopularQuestionCard
                        icon="🎯"
                        label="Which AI vendors work in healthcare?"
                        onClick={()=> handleQuickQuestion('Which AI vendors work in healthcare?')}
                      />
                      <PopularQuestionCard
                        icon="💰"
                        label="What is the average cost for ML teams?"
                        onClick={()=> handleQuickQuestion('What is the average cost for ML development teams?')}
                      />
                      <PopularQuestionCard
                        icon="🚀"
                        label="Show me top blockchain vendors"
                        onClick={()=> handleQuickQuestion('Show me top blockchain vendors')}
                      />
                      <PopularQuestionCard
                        icon="🏗️"
                        label="Find blockchain developers for hire"
                        onClick={()=> handleQuickQuestion('Find blockchain developers for hire')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation */}
              {!showWelcome && (
                <div className="space-y-2">
                  {messages.map(m=> {
                    if (m.type === 'user'){
                      return <UserBubble key={m.id} content={m.content} timestamp={m.timestamp} />
                    }
                    if (m.type === 'assistant'){
                      return (
                        <AiBubble key={m.id} content={m.content} timestamp={m.timestamp} />
                      )
                    }
                    if (m.type === 'sponsored'){
                      return (
                        <SponsoredVendorCard
                          key={m.id}
                          isSaved={savedVendors.includes('fintech-ai-solutions')}
                          onToggleSave={()=> toggleSaveVendor('fintech-ai-solutions', 'FinTech AI Solutions')}
                        />
                      )
                    }
                    if (m.type === 'vendors'){
                      return (
                        <div key={m.id} className="mt-2 space-y-3">
                          <AiBubble content="Here are more top-rated options from our database:">
                            <div className="mt-3">
                              <RegularVendorCard
                                name="PredictFinance Pro"
                                rating="4.6/5"
                                reviews={189}
                                tags={[ 'Finance','Machine Learning' ]}
                                description="Enterprise-grade forecasting with ML models trained on 10+ years of market data."
                                isSaved={savedVendors.includes('predictfinance-pro')}
                                onToggleSave={()=> toggleSaveVendor('predictfinance-pro', 'PredictFinance Pro')}
                              />
                              <RegularVendorCard
                                name="ForecastAI"
                                rating="4.4/5"
                                reviews={156}
                                tags={[ 'Finance','Artificial Intelligence' ]}
                                description="Real-time predictions with explainable AI and risk analysis."
                                isSaved={savedVendors.includes('forecastai')}
                                onToggleSave={()=> toggleSaveVendor('forecastai', 'ForecastAI')}
                              />
                              <RegularVendorCard
                                name="SmartForecaster"
                                rating="4.3/5"
                                reviews={142}
                                tags={[ 'Finance','Predictive Analytics' ]}
                                description="Cloud-based forecasting with automated data pipelines and dashboards."
                                isSaved={savedVendors.includes('smartforecaster')}
                                onToggleSave={()=> toggleSaveVendor('smartforecaster', 'SmartForecaster')}
                              />
                              <div className="mt-4 flex flex-wrap gap-2">
                                <QuickActionPill label="🔄 Compare These 4" onClick={()=> {}} />
                                <QuickActionPill label="📊 Show 4 More" onClick={()=> {}} />
                                <QuickActionPill label="🎯 Filter by Price" onClick={()=> {}} />
                                <QuickActionPill label="📅 Schedule Multiple Demos" onClick={()=> {}} />
                                <QuickActionPill label="💾 Save All to Workspace" onClick={()=> {}} />
                                <QuickActionPill label="⬅️ Go back to default" onClick={resetToDefault} />
                              </div>
                            </div>
                          </AiBubble>
                        </div>
                      )
                    }
                    return null
                  })}
                  {isThinking && <TypingIndicator />}
                </div>
              )}
            </div>
          </div>

          <ChatInput value={input} onChange={setInput} onSend={()=> sendMessage()} />
        </main>
      </div>
    </div>
  )
}


