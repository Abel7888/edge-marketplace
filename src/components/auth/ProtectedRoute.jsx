'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }){
  const { currentUser, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace(`/login?from=${pathname}`)
    }
  }, [currentUser, loading, router, pathname])
  
  if (loading) return null
  if (!currentUser) return null
  return children
}

