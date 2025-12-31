'use client'


import { useEffect, useMemo, useState } from 'react'
import { Heart, ExternalLink, Trash2, Calendar, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeSavedVendors, removeSavedVendor, fetchSavedVendors } from '../lib/firestoreSaved.js'
import { subscribeVendors } from '../lib/firestoreVendors.js'

function pick(val, def){ return val==null? def : val }

// Default sample vendors to always show
const DEFAULT_SAMPLES = [
  {
    vendorId: 'sample-stripe',
    name: 'Stripe (Sample)',
    logoEmoji: '💳',
    website: 'https://stripe.com',
    summary: 'Payments infrastructure for the internet. Accept payments, send payouts, and manage online businesses.',
    savedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isSample: true,
  },
  {
    vendorId: 'sample-proptech',
    name: 'Smart Building Co (Sample)',
    logoEmoji: '🏢',
    website: 'https://example.com',
    summary: 'IoT-enabled property management and smart building automation for commercial real estate.',
    savedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    isSample: true,
  },
]

export default function SavedVendors(){
  const { currentUser } = useAuth()
  const [savedVendors, setSavedVendors] = useState([])
  const [allVendors, setAllVendors] = useState([])

  useEffect(()=>{
    if (!currentUser) {
      console.log('[SavedVendors] No currentUser, skipping subscriptions')
      return
    }
    console.log('[SavedVendors] currentUser:', currentUser.uid, currentUser.email)
    // live vendors list
    const unsubV = subscribeVendors((list)=> setAllVendors(list))
    // live saved ids
    const unsubS = subscribeSavedVendors(currentUser.uid, (savedList)=>{
      console.log('[SavedVendors] Received savedList from Firestore:', savedList.length, 'docs')
      const byId = new Map(allVendors.map(v=> [String(v.id), v]))
      const joined = savedList.map(s => {
        const rawId = s.id || s.vendorId
        const base = byId.get(String(rawId)) || {}
        const result = {
          vendorId: String(rawId),
          name: pick(base.name, s.name) || 'Vendor',
          logoEmoji: base.logoEmoji || s.logoEmoji || '🏢',
          logoUrl: base.logoUrl || s.logoUrl || null,
          website: base.website || base.url || s.website || '',
          summary: base.tagline || base.shortDescription || s.summary || 'Emerging tech vendor',
          savedAt: s.savedAt?.toDate? s.savedAt.toDate().toISOString() : new Date().toISOString(),
          lastViewed: base.lastUpdated || base.createdAt || new Date().toISOString(),
        }
        console.log('[SavedVendors] Joined vendor:', result.name, result.vendorId, 'logoUrl:', result.logoUrl)
        return result
      })
      console.log('[SavedVendors] Setting savedVendors state with', joined.length, 'items')
      setSavedVendors(joined)
    })
    // immediate fallback fetch (handles new accounts or snapshot delays)
    fetchSavedVendors(currentUser.uid).then(savedList => {
      console.log('[SavedVendors] Initial fetch returned', savedList.length, 'docs')
      const byId = new Map(allVendors.map(v=> [String(v.id), v]))
      const joined = savedList.map(s => {
        const rawId = s.id || s.vendorId
        const base = byId.get(String(rawId)) || {}
        return {
          vendorId: String(rawId),
          name: pick(base.name, s.name) || 'Vendor',
          logoEmoji: base.logoEmoji || s.logoEmoji || '🏢',
          logoUrl: base.logoUrl || s.logoUrl || null,
          website: base.website || base.url || s.website || '',
          summary: base.tagline || base.shortDescription || s.summary || 'Emerging tech vendor',
          savedAt: s.savedAt?.toDate? s.savedAt.toDate().toISOString() : new Date().toISOString(),
          lastViewed: base.lastUpdated || base.createdAt || new Date().toISOString(),
        }
      })
      console.log('[SavedVendors] Initial fetch setting state with', joined.length, 'items')
      setSavedVendors(joined)
    }).catch((err)=>{
      console.error('[SavedVendors] Initial fetch failed:', err)
    })
    return ()=> { unsubV && unsubV(); unsubS && unsubS() }
  }, [currentUser])

  const simplified = useMemo(()=> {
    // Combine real saved vendors with default samples
    const combined = [...DEFAULT_SAMPLES, ...savedVendors]
    return combined.sort((a,b)=> new Date(b.savedAt)-new Date(a.savedAt))
  }, [savedVendors])
  async function toggleSave(vendorId){
    if (!currentUser) return
    try { await removeSavedVendor(currentUser.uid, String(vendorId)) } catch {}
  }

  async function manualRefresh(){
    if (!currentUser) return
    console.log('[SavedVendors] Manual refresh triggered')
    try {
      const savedList = await fetchSavedVendors(currentUser.uid)
      console.log('[SavedVendors] Manual refresh got', savedList.length, 'docs')
      console.log('[SavedVendors] Raw savedList from Firestore:', savedList)
      const byId = new Map(allVendors.map(v=> [String(v.id), v]))
      const joined = savedList.map(s => {
        const rawId = s.id || s.vendorId
        const base = byId.get(String(rawId)) || {}
        return {
          vendorId: String(rawId),
          name: pick(base.name, s.name) || 'Vendor',
          logoEmoji: base.logoEmoji || s.logoEmoji || '🏢',
          logoUrl: base.logoUrl || s.logoUrl || null,
          website: base.website || base.url || s.website || '',
          summary: base.tagline || base.shortDescription || s.summary || 'Emerging tech vendor',
          savedAt: s.savedAt?.toDate? s.savedAt.toDate().toISOString() : new Date().toISOString(),
          lastViewed: base.lastUpdated || base.createdAt || new Date().toISOString(),
        }
      })
      console.log('[SavedVendors] Manual refresh setting state with', joined.length, 'items')
      setSavedVendors(joined)
    } catch (err) {
      console.error('[SavedVendors] Manual refresh failed:', err)
    }
  }

  async function testSave(){
    if (!currentUser) { alert('Not logged in!'); return }
    const testVendor = {
      id: 'test-' + Date.now(),
      name: 'Test Vendor ' + new Date().toLocaleTimeString(),
      website: 'https://test.com',
      tagline: 'This is a test save from the Saved page',
      logoEmoji: '🧪',
    }
    try {
      console.log('[SavedVendors] Test save starting...')
      await import('../lib/firestoreSaved.js').then(m => m.saveVendor(currentUser.uid, testVendor.id, testVendor))
      console.log('[SavedVendors] Test save complete!')
      alert('Test save complete! Click Refresh button to see it.')
    } catch (err) {
      console.error('[SavedVendors] Test save failed:', err)
      alert('Test save failed: ' + err.message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Saved Vendors</h1>
      <p className="text-gray-600 mt-1">A safe place to remember vendors you came across and may want to research later.</p>
      
      {/* Debug info */}
      <div className="mt-4 p-3 rounded-lg bg-gray-100 border text-xs font-mono">
        <div className="flex items-center justify-between">
          <div>
            <div><strong>Debug Info:</strong></div>
            <div>Logged in: {currentUser ? '✅ ' + currentUser.email : '❌ No'}</div>
            <div>Real saved vendors: {savedVendors.length}</div>
            <div>Total displayed (with samples): {simplified.length}</div>
          </div>
          <button onClick={manualRefresh} className="px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">
            🔄 Refresh Now
          </button>
        </div>
      </div>
      
      {savedVendors.length === 0 && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="text-sm text-blue-900">
            <strong>💡 Demo cards shown below.</strong> When you click "Save Vendor" on any vendor page (FinTech, PropTech, etc.), it will appear here alongside these samples.
          </div>
          <button onClick={testSave} className="mt-3 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700">
            🧪 Test Save Function (Debug)
          </button>
        </div>
      )}
      
      {simplified.length===0 ? (
        <EmptyState />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4">
          {simplified.map(v => (
            <SimpleVendorCard key={v.vendorId} v={v} onUnsave={()=> toggleSave(v.vendorId)} />
          ))}
        </div>
      )}
    </div>
  )
}

function SimpleVendorCard({ v, onUnsave }){
  const [msg, setMsg] = useState('')
  const isSample = v.isSample
  return (
    <article className={`rounded-2xl p-4 border shadow-sm ${
      isSample ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl grid place-items-center bg-gray-100 overflow-hidden">
          {v.logoUrl ? (
            <img src={v.logoUrl} alt={v.name} className="w-8 h-8 object-contain" />
          ) : (
            <span className="text-2xl">{v.logoEmoji}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-slate-900 truncate">
            {v.name}
            {isSample && <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Demo Card</span>}
          </div>
          <div className="text-xs text-gray-500">Saved {Math.max(1, Math.round((Date.now()-new Date(v.savedAt))/86400000))} days ago</div>
          <div className="mt-1 text-sm text-gray-700 line-clamp-2">{v.summary}</div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-700 font-medium"><ExternalLink size={14}/> Visit Website</a>}
            {!isSample && <button onClick={onUnsave} className="inline-flex items-center gap-1 text-red-600"><Trash2 size={14}/> Remove</button>}
          </div>
        </div>
        {!isSample && <button title="Unsave" onClick={onUnsave} className="w-9 h-9 grid place-items-center rounded-full bg-white border border-gray-200 hover:border-red-300"><Heart className="text-red-500" size={16} /></button>}
      </div>
      <div className="mt-3 p-3 rounded-xl bg-gray-50 border">
        <div className="text-xs uppercase text-gray-500">Next actions</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <button className="px-3 py-2 rounded-lg border bg-white text-sm inline-flex items-center gap-2"><FileText size={14}/> Run Quick Research</button>
          <button className="px-3 py-2 rounded-lg border bg-white text-sm inline-flex items-center gap-2"><Calendar size={14}/> Request Demo</button>
          <button className="px-3 py-2 rounded-lg border bg-white text-sm inline-flex items-center gap-2"><FileText size={14}/> Get Research Report</button>
        </div>
        <div className="mt-3">
          <label className="text-sm text-gray-700">Ask a question about this vendor</label>
          <div className="mt-1 flex gap-2">
            <textarea value={msg} onChange={e=> setMsg(e.target.value)} placeholder="e.g. Summarize key strengths and risks, or draft a demo request..." className="flex-1 min-h-[70px] border rounded-lg p-2 text-sm" />
            <button disabled={!msg.trim()} onClick={()=> setMsg('')} className="h-[70px] px-4 rounded-lg bg-blue-600 text-white text-sm disabled:bg-gray-200">Submit</button>
          </div>
        </div>
      </div>
    </article>
  )
}
function EmptyState(){
  return (
    <div className="mt-8 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 grid place-items-center text-gray-500">♡</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">No saved vendors yet</div>
      <div className="text-gray-600">Click the ❤️ icon on any vendor card to save it here for easy comparison</div>
      <a href="/discover" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white">Start Exploring Vendors</a>
      <div className="mt-2 text-sm text-gray-600">✓ Save vendors for later • ✓ Compare up to 3 • ✓ Share lists with your team</div>
    </div>
  )
}

