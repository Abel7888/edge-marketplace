'use client'


import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext.jsx'
import { db } from '../lib/firebase.js'
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { Heart, DollarSign, Users, MapPin, Code, Briefcase, Star, Trash2, CheckCircle2, Globe, MessageSquare, FileText, Search, Send, Check } from 'lucide-react'

export default function SavedFirms() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [savedFirms, setSavedFirms] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!currentUser) {
      router.push('/login?redirect=/saved-firms')
      return
    }
    loadSavedFirms()
  }, [currentUser, router])

  const loadSavedFirms = async () => {
    if (!currentUser) return
    try {
      const q = query(collection(db, 'savedFirms'), where('userId', '==', currentUser.uid))
      const snapshot = await getDocs(q)
      const firms = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }))
      setSavedFirms(firms)
    } catch (error) {
      console.error('Error loading saved firms:', error)
    }
  }

  const removeFirm = async (firmDocId) => {
    try {
      await deleteDoc(doc(db, 'savedFirms', firmDocId))
      setSavedFirms(prev => prev.filter(f => f.docId !== firmDocId))
    } catch (error) {
      console.error('Error removing firm:', error)
    }
  }

  const requestAction = async (firmDocId, actionType) => {
    try {
      const firm = savedFirms.find(f => f.docId === firmDocId)
      
      // Send to Formspree
      const response = await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: actionType === 'researchRequested' ? 'Firm Research Request' : 'Firm Case Studies Request',
          firmName: firm.firmName,
          firmId: firm.firmId,
          category: firm.category,
          teamSize: firm.teamSize,
          rateRange: firm.rateRange,
          location: firm.location,
          specializations: firm.specializations,
          industries: firm.industries,
          userEmail: currentUser.email,
          userName: currentUser.displayName || currentUser.email,
          submittedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Formspree submission failed')
      }

      // Update Firestore
      const firmRef = doc(db, 'savedFirms', firmDocId)
      await updateDoc(firmRef, {
        [`actions.${actionType}`]: true,
        [`actions.${actionType}RequestedAt`]: serverTimestamp()
      })

      await addDoc(collection(db, 'firmActionRequests'), {
        userId: currentUser.uid,
        firmDocId: firmDocId,
        firmId: firm.firmId,
        firmName: firm.firmName,
        actionType: actionType,
        status: 'pending',
        createdAt: serverTimestamp()
      })

      setSavedFirms(prev => prev.map(f => 
        f.docId === firmDocId 
          ? { ...f, actions: { ...f.actions, [actionType]: true } }
          : f
      ))

      alert(`${actionType === 'researchRequested' ? 'Research' : 'Case Studies'} request submitted successfully!`)
    } catch (error) {
      console.error('Error requesting action:', error)
      alert('Failed to submit request. Please try again.')
    }
  }

  const filteredFirms = filter === 'all' ? savedFirms : savedFirms.filter(f => f.category === filter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Heart size={24} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900">Saved Firms</h1>
              <p className="text-gray-600">Your personalized collection of development firms</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border-2 border-blue-200 p-4 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{savedFirms.length}</div>
            <div className="text-sm text-gray-600">Total Saved</div>
          </div>
          <div className="bg-white rounded-xl border-2 border-purple-200 p-4 shadow-sm">
            <div className="text-3xl font-bold text-purple-600">{savedFirms.filter(f => f.category === 'ai').length}</div>
            <div className="text-sm text-gray-600">AI / ML Firms</div>
          </div>
          <div className="bg-white rounded-xl border-2 border-pink-200 p-4 shadow-sm">
            <div className="text-3xl font-bold text-pink-600">{savedFirms.filter(f => f.category === 'blockchain').length}</div>
            <div className="text-sm text-gray-600">Blockchain Firms</div>
          </div>
          <div className="bg-white rounded-xl border-2 border-cyan-200 p-4 shadow-sm">
            <div className="text-3xl font-bold text-cyan-600">{savedFirms.filter(f => f.category === 'arvr' || f.category === 'iot').length}</div>
            <div className="text-sm text-gray-600">AR/VR & IoT</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}>
            All ({savedFirms.length})
          </button>
          <button onClick={() => setFilter('ai')} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'ai' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}>
            🧠 AI/ML ({savedFirms.filter(f => f.category === 'ai').length})
          </button>
          <button onClick={() => setFilter('blockchain')} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'blockchain' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}>
            ⛓️ Blockchain ({savedFirms.filter(f => f.category === 'blockchain').length})
          </button>
          <button onClick={() => setFilter('arvr')} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'arvr' ? 'bg-pink-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}>
            🥽 AR/VR ({savedFirms.filter(f => f.category === 'arvr').length})
          </button>
          <button onClick={() => setFilter('iot')} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'iot' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}>
            📡 IoT ({savedFirms.filter(f => f.category === 'iot').length})
          </button>
        </div>

        {/* Empty State */}
        {savedFirms.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Saved Firms Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Start building your collection by saving firms you're interested in working with</p>
            <button onClick={() => router.push('/hire')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
              <Briefcase size={20} />
              Browse Development Firms
            </button>
          </div>
        )}

        {/* Firms Grid */}
        {filteredFirms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFirms.map(firm => {
              const categoryColors = {
                ai: 'from-blue-500 to-indigo-600',
                blockchain: 'from-purple-500 to-pink-600',
                arvr: 'from-pink-500 to-rose-600',
                iot: 'from-cyan-500 to-teal-600'
              }

              return (
                <div key={firm.docId} className="bg-white rounded-3xl border-2 border-gray-200 hover:border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Header Section */}
                  <div className={`bg-gradient-to-br ${categoryColors[firm.category] || 'from-gray-400 to-gray-600'} p-5 relative`}>
                    <div className="absolute inset-0 bg-black/5" />
                    <button 
                      onClick={() => removeFirm(firm.docId)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110 shadow-lg z-10"
                    >
                      <Trash2 size={18} className="text-rose-600" />
                    </button>
                    
                    <div className="relative flex items-start gap-4">
                      {/* Logo */}
                      <div className="w-14 h-14 rounded-xl bg-white border-3 border-white shadow-xl flex items-center justify-center flex-shrink-0">
                        {firm.logoUrl ? (
                          <img src={firm.logoUrl} alt={firm.firmName} className="max-h-8 object-contain" />
                        ) : (
                          <div className="text-2xl">{firm.logo || '🏢'}</div>
                        )}
                      </div>
                      
                      {/* Firm Header Info */}
                      <div className="flex-1 text-white">
                        <h3 className="text-lg font-extrabold mb-1.5 flex items-center gap-1.5">
                          {firm.firmName}
                          {firm.verified && (
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                              <CheckCircle2 size={12} className="text-blue-600" />
                            </div>
                          )}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            <MapPin size={12} />
                            <span className="text-xs font-medium">{firm.location || 'Global'}</span>
                          </div>
                          {firm.bestFor && (
                            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Star size={12} />
                              <span className="text-xs font-medium">Best for {firm.bestFor}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Key Stats in Header */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5">
                            <div className="text-[10px] opacity-90">Team Size</div>
                            <div className="text-sm font-bold">{firm.teamSize || 'N/A'}</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5">
                            <div className="text-[10px] opacity-90">Rate</div>
                            <div className="text-xs font-bold leading-tight">${firm.rateRange?.[0]}-${firm.rateRange?.[1]}</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5">
                            <div className="text-[10px] opacity-90">Founded</div>
                            <div className="text-sm font-bold">{firm.founded || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    {/* About */}
                    {firm.about && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                          <Briefcase size={14} className="text-blue-600" />
                          What They Do
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-xs">{firm.about}</p>
                      </div>
                    )}

                    {/* Core Expertise */}
                    {firm.specializations && firm.specializations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                          <Star size={14} className="text-yellow-500" />
                          Core Expertise
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {firm.specializations.map(spec => (
                            <span key={spec} className="px-2 py-1 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Industries */}
                    {firm.industries && firm.industries.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                          <Briefcase size={14} className="text-purple-600" />
                          Industry Experience
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {firm.industries.map(ind => (
                            <span key={ind} className="px-2 py-1 rounded-md bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-[10px] font-semibold border border-purple-200">
                              {ind}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Items */}
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                        <Send size={14} className="text-blue-600" />
                        Take Action
                      </h4>
                      
                      <div className="grid grid-cols-1 gap-2 mb-3">
                        {/* Research */}
                        <button
                          onClick={() => requestAction(firm.docId, 'researchRequested')}
                          disabled={firm.actions?.researchRequested}
                          className={`group relative overflow-hidden rounded-lg p-3 text-left transition-all ${
                            firm.actions?.researchRequested
                              ? 'bg-green-50 border-2 border-green-300 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              firm.actions?.researchRequested ? 'bg-green-500' : 'bg-white/20'
                            }`}>
                              {firm.actions?.researchRequested ? (
                                <Check size={16} className="text-white" />
                              ) : (
                                <Search size={16} className="text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className={`font-bold text-xs ${
                                firm.actions?.researchRequested ? 'text-green-700' : 'text-white'
                              }`}>
                                {firm.actions?.researchRequested ? 'Research Requested' : 'Request Research'}
                              </div>
                              <div className={`text-[10px] ${
                                firm.actions?.researchRequested ? 'text-green-600' : 'text-white/80'
                              }`}>
                                {firm.actions?.researchRequested ? 'We\'ll send you detailed analysis' : 'Get detailed analysis & reviews'}
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Case Studies */}
                        <button
                          onClick={() => requestAction(firm.docId, 'caseStudiesRequested')}
                          disabled={firm.actions?.caseStudiesRequested}
                          className={`group relative overflow-hidden rounded-lg p-3 text-left transition-all ${
                            firm.actions?.caseStudiesRequested
                              ? 'bg-green-50 border-2 border-green-300 cursor-not-allowed'
                              : 'bg-gradient-to-r from-orange-500 to-red-600 hover:scale-105 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              firm.actions?.caseStudiesRequested ? 'bg-green-500' : 'bg-white/20'
                            }`}>
                              {firm.actions?.caseStudiesRequested ? (
                                <Check size={16} className="text-white" />
                              ) : (
                                <FileText size={16} className="text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className={`font-bold text-xs ${
                                firm.actions?.caseStudiesRequested ? 'text-green-700' : 'text-white'
                              }`}>
                                {firm.actions?.caseStudiesRequested ? 'Case Studies Requested' : 'Get Case Studies'}
                              </div>
                              <div className={`text-[10px] ${
                                firm.actions?.caseStudiesRequested ? 'text-green-600' : 'text-white/80'
                              }`}>
                                {firm.actions?.caseStudiesRequested ? 'We\'ll send you project examples' : 'View real project examples'}
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Bottom Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => router.push('/hire/request-information', { state: { firmId: firm.firmId, firmName: firm.firmName } })}
                          className="h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:scale-105 transition-transform flex items-center justify-center gap-1.5 shadow-lg">
                          <MessageSquare size={14} />
                          Get Info
                        </button>
                        {firm.website && (
                          <a 
                            href={firm.website}
                            target="_blank"
                            rel="noreferrer"
                            className="h-10 rounded-lg border-2 border-blue-600 bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5">
                            <Globe size={14} />
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

