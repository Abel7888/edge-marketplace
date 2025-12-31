import { db } from './firebase'
import { collection, doc, getDocs, onSnapshot, writeBatch, serverTimestamp, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore'
import vendorsData from '../data/vendors.js'

export async function seedVendors(){
  const col = collection(db, 'vendors')
  const batch = writeBatch(db)
  const now = serverTimestamp()
  const toWrite = vendorsData.map(v => ({
    ...v,
    createdAt: now,
    updatedAt: now,
    mediaUrls: {
      logoUrl: v.logoUrl || '',
      videoUrl: v.media?.videoUrl || '',
      caseStudyUrl: v.media?.caseStudyUrl || '',
      images: v.media?.images || [],
    },
  }))
  const chunkSize = 400
  for (let i=0;i<toWrite.length;i++){
    const ref = doc(col)
    batch.set(ref, toWrite[i])
    if ((i>0 && i % chunkSize===0) || i===toWrite.length-1){
      await batch.commit()
      if (i!==toWrite.length-1){
        // start a new batch
        // eslint-disable-next-line no-unused-vars
        var _reset = true
      }
    }
  }
}

export async function fetchVendorsOnce(){
  const col = collection(db, 'vendors')
  const q = query(col, orderBy('createdAt','desc'))
  const snap = await getDocs(q)
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  return list
}

export function subscribeVendors(cb){
  const col = collection(db, 'vendors')
  const q = query(col, orderBy('createdAt','desc'))
  return onSnapshot(q, (snap)=>{
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    cb(list)
  })
}

export async function addVendor(vendorData){
  const col = collection(db, 'vendors')
  const now = serverTimestamp()
  const docRef = await addDoc(col, { ...vendorData, createdAt: now, updatedAt: now })
  return docRef.id
}

export async function updateVendor(vendorId, updates){
  const ref = doc(db, 'vendors', vendorId)
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() })
}

export async function deleteVendorById(vendorId){
  const ref = doc(db, 'vendors', vendorId)
  await deleteDoc(ref)
}

// One-time utility: replace AI vendors in Software subcategory with curated list
// Usage example:
// import { replaceAISoftwareVendors } from '../lib/firestoreVendors'
// await replaceAISoftwareVendors(curatedList)
export async function replaceAISoftwareVendors(curatedList){
  const col = collection(db, 'vendors')
  // Delete existing Software -> AI vendors
  const q = query(col, where('subcategory','==','Software'), where('category','==','AI'))
  const snap = await getDocs(q)
  const batch = writeBatch(db)
  snap.docs.forEach(d => batch.delete(d.ref))
  // Insert curated
  const now = serverTimestamp()
  curatedList.forEach(v => {
    const ref = doc(col)
    batch.set(ref, { ...v, createdAt: now, updatedAt: now })
  })
  await batch.commit()
}
