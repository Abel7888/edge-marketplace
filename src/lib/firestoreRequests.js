import { db } from './firebase'
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'

export async function createRequest({ userId, vendorId, type, status='pending', formData }){
  const col = collection(db, 'requests')
  const now = serverTimestamp()
  const timeline = [{ action: 'submitted', date: now, by: userId }]
  const docRef = await addDoc(col, { userId, vendorId, type, status, formData, timeline, createdAt: now, updatedAt: now })
  return docRef.id
}

export async function fetchUserRequests(userId){
  const col = collection(db, 'requests')
  const q = query(col, where('userId','==', userId), orderBy('createdAt','desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export function subscribeUserRequests(userId, cb){
  const col = collection(db, 'requests')
  const q = query(col, where('userId','==', userId), orderBy('createdAt','desc'))
  return onSnapshot(q, (snap)=>{
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    cb(list)
  })
}

export async function updateRequestStatus(requestId, status, by){
  const ref = doc(db, 'requests', requestId)
  await updateDoc(ref, { status, updatedAt: serverTimestamp() })
}

// Convenience: create a demo request
export async function createDemoRequest({ userId, vendorId, formData, status='pending' }){
  return await createRequest({ userId, vendorId, type: 'demo', status, formData })
}

// Convenience: create a compare request
export async function createCompareRequest({ userId, formData, status='pending' }){
  return await createRequest({ userId, vendorId: null, type: 'compare', status, formData })
}

// Admin: subscribe to all demo requests
export function subscribeAllDemoRequests(cb){
  const col = collection(db, 'requests')
  const q = query(col, where('type','==','demo'), orderBy('createdAt','desc'))
  return onSnapshot(q, (snap)=>{
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    cb(list)
  })
}
