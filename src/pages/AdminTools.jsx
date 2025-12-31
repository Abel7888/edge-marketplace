import { useState } from 'react'
import { seedVendors, fetchVendorsOnce } from '../lib/firestoreVendors'

export default function AdminTools(){
  const [seeding, setSeeding] = useState(false)
  const [message, setMessage] = useState('')
  const [count, setCount] = useState(null)

  async function runSeed(){
    setMessage('')
    setSeeding(true)
    try{
      await seedVendors()
      setMessage('Vendors seed completed.')
      const list = await fetchVendorsOnce()
      setCount(list.length)
    }catch(e){
      setMessage(e.message || 'Seed failed')
    }finally{ setSeeding(false) }
  }

  async function checkCount(){
    setMessage('')
    const list = await fetchVendorsOnce()
    setCount(list.length)
  }

  return (
    <div className="max-w-2xl mx-auto pt-28 px-6">
      <div className="bg-white border rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900">Admin Tools</h1>
        <p className="text-sm text-gray-600">Utilities to initialize Firestore with vendor data. Only run seeding once.</p>
        <div className="mt-4 flex items-center gap-2">
          <button onClick={runSeed} disabled={seeding} className="h-10 px-4 rounded-lg bg-blue-600 text-white font-semibold">{seeding? 'Seeding…' : 'Seed Vendors (270)'}
          </button>
          <button onClick={checkCount} className="h-10 px-4 rounded-lg border">Check Count</button>
        </div>
        {message && <div className="mt-3 text-sm">{message}</div>}
        {count!==null && <div className="mt-1 text-sm text-gray-700">Vendors in Firestore: {count}</div>}
      </div>
    </div>
  )
}
