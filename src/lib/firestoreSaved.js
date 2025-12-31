import { db } from './firebase'
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'

export async function saveVendor(userId, vendorId, data = {}){
  const ref = doc(db, 'savedVendors', userId, 'vendors', vendorId)
  const payload = {
    vendorId,
    savedAt: serverTimestamp(),
    // Optional snapshot metadata to ensure SavedVendors can render even if central catalog lacks this id
    name: data.name ?? null,
    website: data.website ?? null,
    summary: data.summary ?? data.tagline ?? data.shortDescription ?? data.fullDescription?.slice(0, 160) ?? null,
    tagline: data.tagline ?? null,
    description: data.description ?? data.fullDescription ?? data.about ?? null,
    logoEmoji: data.logoEmoji ?? null,
    logoUrl: data.logoUrl ?? null,
    category: data.category ?? null,
    location: data.location ?? null,
    verified: data.verified ?? false,
    tags: data.tags ?? data.solutions ?? data.industries ?? [],
  }
  console.log('[saveVendor] Writing to Firestore:', { userId, vendorId, name: data?.name, path: ref.path })
  console.log('[saveVendor] Payload:', payload)
  await setDoc(ref, payload, { merge: true })
  console.log('[saveVendor] Write complete!')
}

export async function removeSavedVendor(userId, vendorId){
  const ref = doc(db, 'savedVendors', userId, 'vendors', vendorId)
  await deleteDoc(ref)
}

export async function fetchSavedVendors(userId){
  const col = collection(db, 'savedVendors', userId, 'vendors')
  const q = query(col)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export function subscribeSavedVendors(userId, cb){
  const col = collection(db, 'savedVendors', userId, 'vendors')
  const q = query(col)
  return onSnapshot(q, (snap)=>{
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    try { console.log('[subscribeSavedVendors] docs', list.length) } catch {}
    cb(list)
  }, (err)=>{
    try { console.error('[subscribeSavedVendors] error', err?.code || err?.message || err) } catch {}
  })
}
