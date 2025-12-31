import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db, googleProvider } from '../lib/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  async function signup(email, password, userData = {}){
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (userData.name) {
      await updateProfile(cred.user, { displayName: userData.name })
    }
    const ref = doc(db, 'users', cred.user.uid)
    await setDoc(ref, {
      email,
      name: userData.name || '',
      role: userData.role || 'buyer',
      company: userData.company || '',
      industry: userData.industry || '',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      savedVendors: [],
    }, { merge: true })
    return cred.user
  }

  function login(email, password){
    return signInWithEmailAndPassword(auth, email, password)
  }

  function loginWithGoogle(){
    return signInWithPopup(auth, googleProvider)
  }

  function resetPassword(email){
    return sendPasswordResetEmail(auth, email)
  }

  function logout(){
    return signOut(auth)
  }

  const value = { currentUser, loading, signup, login, loginWithGoogle, resetPassword, logout }
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
