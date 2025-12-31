import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const { currentUser, login, loginWithGoogle, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) navigate('/discover', { replace: true })
  }, [currentUser, navigate])

  async function onSubmit(e){
    e.preventDefault()
    setErr('')
    setInfo('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/discover')
    } catch (e) {
      setErr(e.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  async function onGoogle(){
    setErr('')
    setInfo('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/discover')
    } catch (e) {
      setErr(e.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  async function onReset(){
    setErr('')
    setInfo('')
    if (!email) { setErr('Enter your email to reset password'); return }
    try {
      await resetPassword(email)
      setInfo('Password reset email sent')
    } catch (e) {
      setErr(e.message || 'Failed to send reset email')
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto pt-28 px-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="text-sm text-gray-600">Welcome back. Sign in to continue.</p>
          {err && <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</div>}
          {info && <div className="mt-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{info}</div>}
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input type="email" value={email} onChange={e=> setEmail(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="you@company.com" required />
            </div>
            <div>
              <label className="text-sm text-gray-700">Password</label>
              <input type="password" value={password} onChange={e=> setPassword(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="••••••••" required />
            </div>
            <button disabled={loading} className="w-full h-11 rounded-xl bg-blue-600 text-white font-semibold">{loading? 'Signing in…' : 'Sign in'}</button>
          </form>
          <div className="mt-3">
            <button onClick={onGoogle} disabled={loading} className="w-full h-11 rounded-xl border font-semibold">Continue with Google</button>
          </div>
          <div className="mt-4 text-sm flex items-center justify-between">
            <button onClick={onReset} className="text-blue-600">Forgot password?</button>
            <span>
              Don't have an account? <Link to="/signup" className="text-blue-600">Create one</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
