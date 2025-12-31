'use client'


import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Signup(){
  const { signup, loginWithGoogle } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    setErr('')
    setLoading(true)
    try{
      await signup(email, password, { name, company, industry, role: 'buyer' })
      router.push('/discover')
    }catch(e){
      setErr(e.message || 'Failed to create account')
    }finally{ setLoading(false) }
  }

  async function onGoogle(){
    setErr('')
    setLoading(true)
    try{
      await loginWithGoogle()
      router.push('/discover')
    }catch(e){ setErr(e.message || 'Google sign-up failed') }
    finally{ setLoading(false) }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto pt-28 px-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-sm text-gray-600">Sign up to get started. No credit card required.</p>
          {err && <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</div>}
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-gray-700">Full name</label>
              <input value={name} onChange={e=> setName(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="John Doe" required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input type="email" value={email} onChange={e=> setEmail(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="you@company.com" required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Password</label>
              <input type="password" value={password} onChange={e=> setPassword(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="••••••••" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700">Company</label>
                <input value={company} onChange={e=> setCompany(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="text-sm text-gray-700">Industry</label>
                <input value={industry} onChange={e=> setIndustry(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Healthcare, Construction, etc." />
              </div>
            </div>
            <button disabled={loading} className="w-full h-11 rounded-xl bg-blue-600 text-white font-semibold">{loading? 'Creating…' : 'Create account'}</button>
          </form>
          <div className="mt-3">
            <button onClick={onGoogle} disabled={loading} className="w-full h-11 rounded-xl border font-semibold">Continue with Google</button>
          </div>
          <div className="mt-4 text-sm">Already have an account? <Link href="/login" className="text-blue-600">Sign in</Link></div>
        </div>
      </div>
    </div>
  )
}

