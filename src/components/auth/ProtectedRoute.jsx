import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ children }){
  const { currentUser, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
