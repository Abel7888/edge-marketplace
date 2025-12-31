'use client'


import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Sparkles, TrendingUp, Heart, Briefcase } from 'lucide-react'

export default function DiscoverNew() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    // Industry
    { 
      section: 'Industry Solutions',
      items: [
        { name: 'FinTech', icon: '💰', path: '/discover/fintech', desc: 'Financial services & payments', color: 'from-green-500 to-emerald-600' },
        { name: 'PropTech', icon: '🏢', path: '/discover/proptech', desc: 'Smart buildings & real estate', color: 'from-blue-500 to-cyan-600' },
        { name: 'ConTech', icon: '🏗️', path: '/discover/contech', desc: 'Construction & project mgmt', color: 'from-orange-500 to-amber-600' },
        { name: 'MedTech', icon: '🏥', path: '/discover/medtech', desc: 'Medical devices & diagnostics', color: 'from-red-500 to-rose-600' },
        { name: 'HealthTech', icon: '💊', path: '/discover/healthtech', desc: 'Telemedicine & health platforms', color: 'from-teal-500 to-cyan-600' },
        { name: 'Supply Chain', icon: '🏭', path: '/discover/supply-chain', desc: 'Manufacturing & logistics', color: 'from-emerald-500 to-green-600' },
      ]
    },
    // Software & AI
    {
      section: 'Software & AI',
      items: [
        { name: 'AI', icon: '🤖', path: '/discover/ai', desc: 'Artificial intelligence platforms', color: 'from-blue-600 to-indigo-700' },
        { name: 'ML', icon: '📊', path: '/discover/ml', desc: 'Machine learning & MLOps', color: 'from-emerald-600 to-teal-700' },
        { name: 'IoT', icon: '🌐', path: '/discover/iot', desc: 'Internet of Things & sensors', color: 'from-cyan-600 to-blue-700' },
        { name: 'Web3', icon: '⛓️', path: '/discover/web3', desc: 'Blockchain & decentralized tech', color: 'from-purple-600 to-indigo-700' },
        { name: 'AR/VR', icon: '🥽', path: '/discover/arvr', desc: 'Immersive experiences', color: 'from-pink-600 to-purple-700' },
        { name: 'Digital Twin', icon: '🔄', path: '/discover/digital-twin', desc: 'Virtual replicas & simulation', color: 'from-indigo-600 to-blue-700' },
        { name: 'Edge Computing', icon: '⚡', path: '/discover/edge-computing', desc: 'Real-time edge processing', color: 'from-cyan-600 to-teal-700' },
      ]
    },
    // Hardware & Infrastructure
    {
      section: 'Hardware & Infrastructure',
      items: [
        { name: 'Semiconductors', icon: '💾', path: '/discover/semiconductors', desc: 'Computing & processing', color: 'from-emerald-600 to-cyan-700' },
        { name: 'Automation & Robotics', icon: '🦾', path: '/discover/automation-robotics', desc: 'Industrial automation', color: 'from-amber-600 to-orange-700' },
        { name: 'Power Infrastructure', icon: '⚡', path: '/discover/power-infrastructure', desc: 'Energy & smart grids', color: 'from-emerald-600 to-green-700' },
        { name: '3D Printing', icon: '🧩', path: '/discover/3d-printing', desc: 'Additive manufacturing', color: 'from-fuchsia-600 to-pink-700' },
        { name: 'Quantum Computing', icon: '⚛️', path: '/discover/quantum', desc: 'Next-gen computing', color: 'from-teal-600 to-cyan-700' },
      ]
    }
  ]

  const quickActions = [
    { name: 'Saved Vendors', icon: Heart, path: '/saved-new', color: 'from-rose-500 to-pink-600', desc: 'Your shortlist' },
    { name: 'Hire Teams', icon: Briefcase, path: '/hire', color: 'from-blue-500 to-indigo-600', desc: 'Find developers' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/discover/vendors?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 text-sm text-blue-700 font-medium mb-6">
            <Sparkles size={16} className="text-blue-500" />
            18 Technology Categories • 1000+ Vetted Vendors
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            Discover Emerging Tech<br />That Transforms Business
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-10">
            Browse AI, IoT, Blockchain, and cutting-edge solutions. Connect with verified vendors across 18 specialized categories.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors, technologies, or solutions..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg shadow-lg"
              />
            </div>
          </form>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Vendors', value: '1000+' },
              { label: 'Categories', value: '18' },
              { label: 'Companies Served', value: '1200+' },
              { label: 'Avg Rating', value: '4.8/5' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white shadow-lg`}>
                    <action.icon size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-lg text-gray-900">{action.name}</div>
                    <div className="text-sm text-gray-600">{action.desc}</div>
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      {categories.map((section, sectionIdx) => (
        <section key={sectionIdx} className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="text-blue-600" size={24} />
              <h2 className="text-3xl font-bold text-gray-900">{section.section}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((category, i) => (
                <button
                  key={i}
                  onClick={() => navigate(category.path)}
                  className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 text-left"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{category.icon}</div>
                      <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-lg text-blue-100 mb-8">Start exploring cutting-edge technology vendors today</p>
            <button
              onClick={() => router.push('/discover/vendors')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Browse All Vendors
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

