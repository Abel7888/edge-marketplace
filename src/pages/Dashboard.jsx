'use client'


import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar.jsx'

export default function Dashboard() {
  const [active, setActive] = useState('discover')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-20">
      <div className="md:hidden mb-4 flex justify-between items-center">
        <button onClick={() => setMobileOpen(true)} className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Open Menu</button>
        <div className="text-sm text-gray-600">Active: {active}</div>
      </div>

      <div className="flex gap-6">
        <Sidebar activeKey={active} onChange={setActive} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <section className="flex-1 min-h-[calc(100vh-6rem)]">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Contextual content for: <span className="font-medium text-slate-900">{active}</span></p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100">
                <div className="text-sm text-gray-500">Quick Stat</div>
                <div className="text-2xl font-bold">270 Vendors</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-100">
                <div className="text-sm text-gray-500">Saved</div>
                <div className="text-2xl font-bold">12 Vendors</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

