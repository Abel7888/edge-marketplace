import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from './firebase'

export function uploadFile(file, path, onProgress){
  return new Promise((resolve, reject) => {
    const r = ref(storage, path)
    const task = uploadBytesResumable(r, file)
    task.on('state_changed', (snap)=>{
      const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
      onProgress && onProgress(pct)
    }, reject, async ()=>{
      try{
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }catch(e){ reject(e) }
    })
  })
}
