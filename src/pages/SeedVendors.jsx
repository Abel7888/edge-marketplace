import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import vendorsSeed from '../data/vendorsSeed.js'

export default function SeedVendors(){
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  async function handleSeed(){
    if (status === 'running') return
    setStatus('running')
    setMessage('Seeding vendors to Firestore...')
    try {
      const minimal = vendorsSeed.map(v => ({
        id: v.id,
        name: v.name,
        tagline: v.tagline || '',
        categoryGroup: v.categoryGroup || 'industries',
        category: v.category || null,
        discoverPath: v.discoverPath || null,
        sectionKey: v.sectionKey || null,
        sectionTitle: v.sectionTitle || null,
        website: v.website || null,
        logoUrl: v.logoUrl || null,
        docType: v.docType || 'vendor',
      })).filter(v => v.id && v.name)

      for (const v of minimal){
        const ref = doc(db, 'vendors', String(v.id))
        // upsert minimal fields only
        await setDoc(ref, v, { merge: true })
      }

      setStatus('done')
      setMessage(`Seeded ${minimal.length} vendors into Firestore.`)
    } catch (err){
      console.error(err)
      setStatus('error')
      setMessage('Error seeding vendors. Check console for details.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Seed Vendors to Firestore</h1>
        <p className="text-sm text-gray-600 mb-4">
          This is a temporary utility page to write vendor seed data into the <code>vendors</code> collection.
          Run this once while logged in as an admin, then you can remove this page.
        </p>
        <button
          onClick={handleSeed}
          disabled={status === 'running'}
          className={`w-full h-11 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 ${status === 'running' ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition`}
        >
          {status === 'running' ? 'Seeding...' : 'Seed Vendors'}
        </button>
        {message && (
          <div className="mt-3 text-sm text-gray-700 whitespace-pre-line">{message}</div>
        )}
      </div>
    </div>
  )
}
