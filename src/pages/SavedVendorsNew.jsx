'use client'


import { useEffect, useState } from 'react'
import { Heart, ExternalLink, Trash2, Calendar, FileText, CheckCircle2, MapPin, Star, Building2, Globe, X, Send, Users, TrendingUp, Award } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { collection, onSnapshot, query, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase.js'

export default function SavedVendorsNew(){
  const { currentUser } = useAuth()
  const [vendors, setVendors] = useState([])
  const [debugInfo, setDebugInfo] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('') // 'research' or 'demo'
  const [selectedVendor, setSelectedVendor] = useState(null)

  useEffect(()=>{
    if (!currentUser) {
      console.log('[SavedVendorsNew] No currentUser, skipping')
      return
    }
    
    console.log('[SavedVendorsNew] Setting up listener for user:', currentUser.uid)
    console.log('[SavedVendorsNew] Firestore path: savedVendors/' + currentUser.uid + '/vendors')
    const col = collection(db, 'savedVendors', currentUser.uid, 'vendors')
    const q = query(col)
    
    const unsubscribe = onSnapshot(q, (snapshot)=>{
      console.log('[SavedVendorsNew] ✅ Snapshot received, docs:', snapshot.docs.length)
      const list = snapshot.docs.map(doc => {
        const data = doc.data()
        console.log('[SavedVendorsNew] Doc ID:', doc.id, 'Data:', data)
        return {
          id: doc.id,
          ...data
        }
      })
      console.log('[SavedVendorsNew] ✅ Setting vendors state with', list.length, 'items:', list)
      setVendors(list)
    }, (error)=>{
      console.error('[SavedVendorsNew] ❌ Snapshot error:', error)
    })
    
    return () => {
      console.log('[SavedVendorsNew] Cleaning up listener')
      unsubscribe()
    }
  }, [currentUser])

  async function testDirectRead(){
    if (!currentUser) return
    try {
      console.log('[SavedVendorsNew] Testing direct read...')
      const col = collection(db, 'savedVendors', currentUser.uid, 'vendors')
      const snapshot = await getDocs(query(col))
      console.log('[SavedVendorsNew] Direct read result:', snapshot.docs.length, 'docs')
      snapshot.docs.forEach(doc => {
        console.log('[SavedVendorsNew] Direct read doc:', doc.id, doc.data())
      })
      setDebugInfo(`Direct read: ${snapshot.docs.length} docs found`)
    } catch (err) {
      console.error('[SavedVendorsNew] Direct read failed:', err)
      setDebugInfo(`Direct read error: ${err.message}`)
    }
  }

  async function handleRemove(vendorId){
    if (!currentUser) return
    try {
      const ref = doc(db, 'savedVendors', currentUser.uid, 'vendors', vendorId)
      await deleteDoc(ref)
      console.log('[SavedVendorsNew] Removed:', vendorId)
    } catch (err) {
      console.error('[SavedVendorsNew] Remove failed:', err)
    }
  }

  function openModal(type, vendor) {
    setModalType(type)
    setSelectedVendor(vendor)
    setModalOpen(true)
  }

  if (!currentUser) {
    return (
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-2xl font-bold">Please log in to view saved vendors</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Premium Header */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Heart size={32} className="text-white fill-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Saved Vendors</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Your curated collection of emerging technology solutions</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <CheckCircle2 size={16} className="text-blue-600" />
                <span className="text-gray-700 font-semibold">Verified Solutions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                <Star size={16} className="text-purple-600 fill-purple-600" />
                <span className="text-gray-700 font-semibold">Enterprise Ready</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-gray-700 font-semibold">Market Leaders</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{vendors.length}</div>
            <div className="text-xs text-gray-600 mt-1">Total Saved</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{new Set(vendors.map(v => v.category)).size}</div>
            <div className="text-xs text-gray-600 mt-1">Categories</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{vendors.filter(v => v.verified).length}</div>
            <div className="text-xs text-gray-600 mt-1">Verified</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-orange-200 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">0</div>
            <div className="text-xs text-gray-600 mt-1">Pending Actions</div>
          </div>
        </div>

        {vendors.length === 0 ? (
          <div className="mt-12 text-center bg-white rounded-3xl p-12 border-2 border-gray-200">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 grid place-items-center text-4xl mb-4">♡</div>
            <div className="text-2xl font-bold text-slate-900 mb-2">No saved vendors yet</div>
            <div className="text-gray-600 mb-6">Start exploring and save vendors from any category</div>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/discover/fintech" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all">Explore FinTech</a>
              <a href="/discover/proptech" className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all">Explore PropTech</a>
              <a href="/discover/ai" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all">Explore AI</a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vendors.map(v => (
              <VendorCard 
                key={v.id} 
                vendor={v} 
                onRemove={()=> handleRemove(v.id)}
                onResearch={()=> openModal('research', v)}
                onDemo={()=> openModal('demo', v)}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <RequestModal 
            type={modalType}
            vendor={selectedVendor}
            currentUser={currentUser}
            onClose={()=> setModalOpen(false)}
          />
        )}
      </div>
    </div>
  )
}

function VendorCard({ vendor, onRemove, onResearch, onDemo }){
  const categoryColors = {
    fintech: 'from-emerald-500 via-green-500 to-teal-600',
    proptech: 'from-orange-500 via-amber-500 to-yellow-600',
    contech: 'from-yellow-500 via-orange-500 to-red-600',
    medtech: 'from-red-500 via-rose-500 to-pink-600',
    healthtech: 'from-pink-500 via-fuchsia-500 to-purple-600',
    'supply chain': 'from-indigo-500 via-purple-500 to-pink-600',
    ai: 'from-blue-500 via-indigo-500 to-purple-600',
    ml: 'from-purple-500 via-violet-500 to-fuchsia-600',
    iot: 'from-cyan-500 via-blue-500 to-indigo-600',
    default: 'from-slate-500 via-gray-500 to-zinc-600'
  }

  const cat = (vendor.category || '').toLowerCase()
  const gradient = categoryColors[cat] || categoryColors.default

  return (
    <article className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-blue-200 hover:-translate-y-1">
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-500 pointer-events-none" />
      
      {/* Remove Button */}
      <button 
        onClick={onRemove}
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md shadow-lg hover:bg-red-50 hover:shadow-xl transition-all flex items-center justify-center group/btn border border-gray-200 hover:border-red-200"
        title="Remove from saved"
      >
        <Trash2 size={15} className="text-gray-500 group-hover/btn:text-red-600 transition-colors" />
      </button>

      {/* Premium Header Section with Enhanced Gradient */}
      <div className={`relative bg-gradient-to-br ${gradient} p-5 pb-20 overflow-hidden`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              {vendor.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/25 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-lg border border-white/30">
                  <Star size={10} className="fill-white" />
                  {vendor.category}
                </span>
              )}
            </div>
          </div>
          
          {/* Verified Badge */}
          {vendor.verified && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-[9px] font-semibold border border-white/30">
              <CheckCircle2 size={11} className="fill-white text-transparent" />
              EmergingTech Verified
            </div>
          )}
        </div>

        {/* Premium Logo positioned to overlap */}
        <div className="absolute -bottom-12 left-5">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
            {/* Logo container */}
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl flex items-center justify-center border-4 border-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              {vendor.logoUrl ? (
                <img src={vendor.logoUrl} alt={vendor.name} className="max-h-14 max-w-14 object-contain" />
              ) : (
                <div className="text-4xl">{vendor.logoEmoji || '🏢'}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Better Spacing */}
      <div className="relative pt-16 px-5 pb-4">
        {/* Vendor Name & Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{vendor.name || 'Vendor Name'}</h3>
          <div className="flex items-center gap-3 flex-wrap">
            {vendor.location && (
              <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                <MapPin size={13} className="text-blue-500" />
                <span className="text-[11px] font-medium">{vendor.location}</span>
              </div>
            )}
          </div>
        </div>
      
        {/* Content continues */}

        {/* Tagline */}
        <div className="mb-4">
          <p className="text-gray-600 leading-relaxed text-sm line-clamp-2">{vendor.tagline || vendor.summary || 'Innovative technology solution'}</p>
        </div>

        {/* Key Info Grid */}
        {(vendor.founded || vendor.teamSize) && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            {vendor.founded && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                <div className="text-[10px] text-blue-600 uppercase font-bold mb-1">Founded</div>
                <div className="text-sm font-bold text-gray-900">{vendor.founded}</div>
              </div>
            )}
            {vendor.teamSize && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                <div className="text-[10px] text-purple-600 uppercase font-bold mb-1">Team Size</div>
                <div className="text-sm font-bold text-gray-900">{vendor.teamSize}</div>
              </div>
            )}
          </div>
        )}

        {/* Description Box */}
        {vendor.description && (
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-2 border-blue-100 shadow-sm">
            <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">{vendor.description}</p>
          </div>
        )}

        {/* Tags/Specialties */}
        {vendor.tags && vendor.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Award size={12} className="text-blue-500" />
              <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Specialties</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {vendor.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-bold shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {vendor.website && (
            <a 
              href={vendor.website} 
              target="_blank" 
              rel="noreferrer" 
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold flex items-center justify-center gap-2 transition-all text-sm shadow-lg hover:shadow-xl group/btn"
            >
              <Globe size={16} className="group-hover/btn:scale-110 transition-transform" />
              Visit Website
            </a>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onResearch}
              className="h-11 rounded-xl border-2 border-blue-300 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 bg-white text-gray-800 font-bold flex items-center justify-center gap-2 transition-all text-xs shadow-sm hover:shadow-md group/btn"
            >
              <FileText size={14} className="text-blue-600 group-hover/btn:scale-110 transition-transform" />
              Research
            </button>
            <button 
              onClick={onDemo}
              className="h-11 rounded-xl border-2 border-purple-300 hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 bg-white text-gray-800 font-bold flex items-center justify-center gap-2 transition-all text-xs shadow-sm hover:shadow-md group/btn"
            >
              <Calendar size={14} className="text-purple-600 group-hover/btn:scale-110 transition-transform" />
              Demo
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function RequestModal({ type, vendor, currentUser, onClose }) {
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    company: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      requestType: type === 'research' ? 'Research Request' : 'Demo Request',
      vendorName: vendor?.name || 'Unknown',
      vendorCategory: vendor?.category || 'N/A',
      userName: formData.name,
      userEmail: formData.email,
      company: formData.company,
      message: formData.message,
      preferredDate: formData.preferredDate || 'N/A',
      preferredTime: formData.preferredTime || 'N/A',
      submittedAt: new Date().toISOString()
    }

    try {
      const response = await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error submitting your request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${type === 'research' ? 'from-blue-600 to-indigo-600' : 'from-purple-600 to-pink-600'} text-white relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            {type === 'research' ? <FileText size={24} /> : <Calendar size={24} />}
            <h2 className="text-2xl font-bold">
              {type === 'research' ? 'Request Research' : 'Schedule Demo'}
            </h2>
          </div>
          <p className="text-white/90 text-sm">
            {type === 'research' 
              ? 'Start the research process to get detailed insights and analysis' 
              : 'Set up a time that works for you to see the solution in action'}
          </p>
        </div>

        {/* Vendor Info */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-b-2 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center">
              {vendor?.logoUrl ? (
                <img src={vendor.logoUrl} alt={vendor?.name} className="max-h-10 object-contain" />
              ) : (
                <div className="text-3xl">{vendor?.logoEmoji || '🏢'}</div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{vendor?.name || 'Vendor'}</h3>
              <p className="text-sm text-gray-600">{vendor?.category || 'Technology'}</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-600">
              {type === 'research' 
                ? 'We\'ll start the research process and get back to you soon with detailed insights.' 
                : 'We\'ll coordinate with the vendor and send you confirmation details shortly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="john@company.com"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Company *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Your Company Name"
              />
            </div>

            {type === 'demo' && (
              <>
                {/* Preferred Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>

                {/* Preferred Time */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Preferred Time</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                  >
                    <option value="">Select a time</option>
                    <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
                    <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
                    <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                    <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                    <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
                  </select>
                </div>
              </>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {type === 'research' ? 'What would you like to know?' : 'Additional Notes'} *
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                placeholder={type === 'research' 
                  ? 'e.g., Key strengths, pricing models, integration capabilities, customer reviews...' 
                  : 'e.g., Specific features you want to see, team size, use case details...'}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl ${
                type === 'research'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send size={18} />
                  {type === 'research' ? 'Submit Research Request' : 'Schedule Demo'}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

