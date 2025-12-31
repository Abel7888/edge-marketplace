'use client'


import { useEffect, useMemo, useState } from 'react'
import { Grid3X3 as Grid, GitCompare, PhoneCall, Heart, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

import { useRouter } from 'next/navigation'
import { saveVendor as fsSaveVendor, removeSavedVendor as fsRemoveSavedVendor, subscribeSavedVendors as fsSubscribeSaved } from '../lib/firestoreSaved.js'
import { createDemoRequest } from '../lib/firestoreRequests.js'
import DemoRequestModal from '../components/DemoRequestModal.jsx'

function VendorCard({ v, saved, onToggleSave, onRequestDemo }){
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-purple-500 transition-all duration-300 overflow-hidden relative">
      <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
        <div className="flex items-center justify-between">
          <div className="w-16 h-16 rounded-full bg-white grid place-items-center border-4 border-white shadow overflow-hidden">
            <img src={v.logoUrl || '/logos/placeholder.svg'} alt={v.name} className="max-h-9 object-contain" />
          </div>
          <div className="space-y-1 text-right">
            <div className="inline-block text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">✓ EmergingTech Verified</div>
            {v.isFeatured && <div className="inline-block text-xs font-semibold text-white bg-yellow-500 px-2 py-1 rounded-full ml-2">⭐ Featured</div>}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="text-2xl font-bold text-slate-900">{v.name}</div>
        <div className="text-sm font-semibold text-gray-700 italic mb-4">{v.tagline}</div>
        {Array.isArray(v.industries) && v.industries.length>0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-800 mb-2">Industries</div>
            <div className="flex flex-wrap gap-2">
              {v.industries.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.solutions) && v.solutions.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Solutions</div>
            <div className="flex flex-wrap gap-2">
              {v.solutions.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">{x}</span>)}
            </div>
          </div>
        )}
        {Array.isArray(v.services) && v.services.length>0 && (
          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-800 mb-2">Services</div>
            <div className="flex flex-wrap gap-2">
              {v.services.map(x => <span key={x} className="px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">{x}</span>)}
            </div>
          </div>
        )}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-500">
          <div className="text-sm text-gray-800 leading-6" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '7.5rem' }}>{v.fullDescription || v.about || v.shortDescription || v.tagline}</div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button onClick={onRequestDemo} className="h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold">Request Live Demo</button>
          <a href="/compare" className="h-12 rounded-lg border text-gray-700 grid place-items-center">Request Vetting Review</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {v.website && <a href={v.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-purple-700 font-semibold"><ExternalLink size={14}/> Visit Website</a>}
          <button onClick={onToggleSave} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
            <Heart size={16} className={saved? 'text-red-500' : 'text-gray-400'} /> {saved? 'Saved' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ARVR(){
  const router = useRouter()
  const { currentUser } = useAuth()
  const [saved, setSaved] = useState(new Set())
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoVendor, setDemoVendor] = useState(null)

  useEffect(()=>{
    if (!currentUser) return
    const unsub = fsSubscribeSaved(currentUser.uid, (list)=>{
      setSaved(new Set(list.map(x=> String(x.id))))
    })
    return ()=> unsub && unsub()
  }, [currentUser])

  async function toggleSaveVendor(vendor){
    if (!currentUser){ router.push('/login?redirect=/discover/arvr'); return }
    const id = String(vendor.id)
    const wasSaved = saved.has(id)
    setSaved(prev=> { const n = new Set(prev); wasSaved? n.delete(id): n.add(id); return n })
    try {
      if (wasSaved) {
        await fsRemoveSavedVendor(currentUser.uid, id)
      } else {
        await fsSaveVendor(currentUser.uid, id, { ...vendor, category: 'AR/VR' })
        router.push('/saved-new')
      }
    } catch {
      setSaved(prev=> { const n = new Set(prev); wasSaved? n.add(id): n.delete(id); return n })
    }
  }

  function openDemo(vendor){
    if (!currentUser){ router.push('/login?redirect=/discover/arvr'); return }
    setDemoVendor(vendor)
    setDemoOpen(true)
  }

  async function submitDemo(form){
    if (!currentUser || !demoVendor) return
    await createDemoRequest({
      userId: currentUser.uid,
      vendorId: String(demoVendor.id),
      formData: form,
      status: 'pending'
    })
    setDemoOpen(false)
    setDemoVendor(null)
  }

  const hardwareVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`arvr-hw-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Varjo Technologies', tagline:'Human-eye resolution XR/VR headsets', industries:['Enterprise','Simulation','Design'], solutions:['Headsets','Optics'], services:['Support'], website:'https://varjo.com/', logoUrl:'https://www.google.com/s2/favicons?domain=varjo.com&sz=128', fullDescription:'Varjo builds high-fidelity XR/VR headsets with human-eye resolution and advanced optics for simulation, design, and training use cases in demanding enterprise environments.' }),
      mk(2,{ name:'Pimax Technology', tagline:'Wide-FOV PC VR headsets', industries:['Gaming','Simulation'], solutions:['Headsets'], services:['Support'], website:'https://pimax.com/', logoUrl:'https://www.google.com/s2/favicons?domain=pimax.com&sz=128', fullDescription:'Pimax offers PC VR headsets with ultra-wide fields of view and high refresh rates to enable immersive gaming and simulation experiences.' }),
      mk(3,{ name:'SenseGlove', tagline:'Force-feedback haptic gloves', industries:['Training','Robotics','Research'], solutions:['Haptics'], services:['Support'], website:'https://www.senseglove.com/', logoUrl:'https://www.google.com/s2/favicons?domain=senseglove.com&sz=128', fullDescription:'SenseGlove provides force-feedback haptic gloves to simulate touch and resistance in VR, enhancing training realism and research applications.' }),
      mk(4,{ name:'zSpace, Inc.', tagline:'Spatial computing systems for education', industries:['Education'], solutions:['Displays','Spatial Computing'], services:['Support'], website:'https://zspace.com/', logoUrl:'https://www.google.com/s2/favicons?domain=zspace.com&sz=128', fullDescription:'zSpace delivers spatial computing displays and systems that bring interactive STEM learning and visualization into classrooms and labs.' }),
      mk(5,{ name:'Lynx', tagline:'Mixed reality headset (Lynx R-1)', industries:['Enterprise','Research'], solutions:['Headsets','Mixed Reality'], services:['Support'], website:'https://www.lynx-r.com/', logoUrl:'https://www.google.com/s2/favicons?domain=lynx-r.com&sz=128', fullDescription:'Lynx develops mixed reality headsets emphasizing privacy, optics, and enterprise features for industrial and research scenarios.' }),
      mk(6,{ name:'HP (VR/XR Division)', tagline:'Enterprise VR solutions and headsets', industries:['Enterprise','Training'], solutions:['Headsets','PC VR'], services:['Support'], website:'https://www.hp.com/us-en/vr/', logoUrl:'https://www.google.com/s2/favicons?domain=hp.com&sz=128', fullDescription:'HP provides VR headsets and solutions tailored for enterprise training, design, and simulation workflows with PC integration.' }),
      mk(7,{ name:'HaptX', tagline:'Industrial-grade haptic gloves', industries:['Training','Defense','Research'], solutions:['Haptics'], services:['Support'], website:'https://haptx.com/', logoUrl:'https://www.google.com/s2/favicons?domain=haptx.com&sz=128', fullDescription:'HaptX offers industrial haptic gloves with microfluidic feedback for realistic touch sensations, enabling advanced VR training and simulation.' }),
      mk(8,{ name:'VX Inc.', tagline:'XR hardware and solutions', industries:['Enterprise'], solutions:['Hardware'], services:['Support'], website:'https://vx-inc.com/', logoUrl:'https://www.google.com/s2/favicons?domain=vx-inc.com&sz=128', fullDescription:'VX Inc. develops XR hardware and enterprise-focused solutions to support immersive experiences and deployments.' }),
    ]
  }, [])

  const toolsVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`arvr-tools-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Monado (OpenXR Runtime)', tagline:'Open-source OpenXR runtime', industries:['Developers'], solutions:['OpenXR','Runtime'], services:['Community'], website:'https://monado.freedesktop.org/', logoUrl:'https://www.google.com/s2/favicons?domain=freedesktop.org&sz=128', fullDescription:'Monado is an open-source OpenXR runtime that brings standards-based XR support to Linux and other platforms for developers and researchers.' }),
      mk(2,{ name:'StereoKit', tagline:'Open-source XR library for C#', industries:['Developers'], solutions:['SDK','XR Toolkit'], services:['Docs','Community'], website:'https://stereokit.net/', logoUrl:'https://www.google.com/s2/favicons?domain=stereokit.net&sz=128', fullDescription:'StereoKit is a simple, open-source library for building XR apps in C#, enabling fast iteration for prototypes and production.' }),
      mk(3,{ name:'Mixed Reality Toolkit (MRTK)', tagline:'Cross-platform MRTK for AR/VR', industries:['Developers'], solutions:['Toolkit','UI','Interactions'], services:['OSS','Community'], website:'https://github.com/MixedRealityToolkit', logoUrl:'https://www.google.com/s2/favicons?domain=github.com&sz=128', fullDescription:'MRTK provides cross-platform building blocks for AR/VR apps, including UI, input, and interaction systems used across devices.' }),
      mk(4,{ name:'OpenSpace3D', tagline:'No/low-code XR creation engine', industries:['Education','Training','SMBs'], solutions:['Authoring','Engine'], services:['Community'], website:'https://www.openspace3d.com/', logoUrl:'https://www.google.com/s2/favicons?domain=openspace3d.com&sz=128', fullDescription:'OpenSpace3D is a free engine to create AR/VR/MR experiences without heavy coding, ideal for education and small teams.' }),
      mk(5,{ name:'A-Frame', tagline:'Web framework for building VR experiences', industries:['Web','Education'], solutions:['WebXR','Framework'], services:['Community'], website:'https://aframe.io/', logoUrl:'https://www.google.com/s2/favicons?domain=aframe.io&sz=128', fullDescription:'A-Frame is a web framework for building VR experiences using HTML and JavaScript, enabling easy WebXR development.' }),
      mk(6,{ name:'OpenAR', tagline:'Open AR standards and tools', industries:['Developers'], solutions:['Standards','SDK'], services:['Community'], website:'https://openar.tech/', logoUrl:'https://www.google.com/s2/favicons?domain=openar.tech&sz=128', fullDescription:'OpenAR advances open standards and tools for augmented reality to promote interoperability and accessibility.' }),
      mk(7,{ name:'xeokit SDK', tagline:'Web-based 3D/IFC visualization', industries:['AEC','Digital Twins'], solutions:['Web3D','IFC'], services:['Support'], website:'https://xeokit.io/', logoUrl:'https://www.google.com/s2/favicons?domain=xeokit.io&sz=128', fullDescription:'xeokit SDK provides high-performance web-based 3D visualization for BIM/IFC and digital twins in browsers.' }),
    ]
  }, [])

  const enterpriseVendors = useMemo(()=>{
    const mk = (i, d)=> ({ id:`arvr-ent-${String(i).padStart(3,'0')}`, ...d })
    return [
      mk(1,{ name:'Strivr', tagline:'VR training platform for enterprises', industries:['Enterprise','Training'], solutions:['VR Training','Analytics'], services:['Implementation','Support'], website:'https://www.strivr.com/', logoUrl:'https://www.google.com/s2/favicons?domain=strivr.com&sz=128', fullDescription:'Strivr delivers immersive VR training at scale with analytics to improve workforce performance and retention.' }),
      mk(2,{ name:'TeamViewer Frontline', tagline:'AR-enabled workforce and remote assist', industries:['Industrial','Field Service'], solutions:['Remote Assist','Workflows'], services:['Implementation','Support'], website:'https://www.teamviewer.com/en/frontline/', logoUrl:'https://www.google.com/s2/favicons?domain=teamviewer.com&sz=128', fullDescription:'TeamViewer Frontline powers AR-guided workflows and remote support to increase productivity and reduce errors.' }),
      mk(3,{ name:'VIROO by Virtualware', tagline:'Enterprise VR platform and rooms', industries:['Enterprise','Education'], solutions:['VR Platform','Collaboration'], services:['Implementation','Support'], website:'https://www.virtualware.com/viroo/', logoUrl:'https://www.google.com/s2/favicons?domain=virtualware.com&sz=128', fullDescription:'VIROO provides collaborative VR spaces and platform tools enabling multi-user training and simulation.' }),
      mk(4,{ name:'Elite XR Platform', tagline:'Immersive learning and operations', industries:['Enterprise'], solutions:['Training','Operations'], services:['Implementation','Support'], website:'https://www.elitexr.io/', logoUrl:'https://www.google.com/s2/favicons?domain=elitexr.io&sz=128', fullDescription:'Elite XR delivers immersive learning and operational experiences tailored to enterprise needs.' }),
      mk(5,{ name:'ArborXR', tagline:'XR device management and content distribution', industries:['Enterprise','Education'], solutions:['MDM','Content Mgmt'], services:['Support'], website:'https://arborxr.com/', logoUrl:'https://www.google.com/s2/favicons?domain=arborxr.com&sz=128', fullDescription:'ArborXR provides device management, app distribution, and control for XR fleets used in training and education.' }),
      mk(6,{ name:'ARuVR', tagline:'Enterprise XR training platform', industries:['Enterprise'], solutions:['Training','Authoring'], services:['Implementation','Support'], website:'https://www.aruvr.com/', logoUrl:'https://www.google.com/s2/favicons?domain=aruvr.com&sz=128', fullDescription:'ARuVR offers an enterprise platform to author and deploy AR/VR training content with analytics.' }),
      mk(7,{ name:'CareAR', tagline:'Service experience management with AR', industries:['Field Service','Support'], solutions:['Remote Assist','Guidance'], services:['Platform','Support'], website:'https://www.carear.com/', logoUrl:'https://www.google.com/s2/favicons?domain=carear.com&sz=128', fullDescription:'CareAR (a ServiceNow company) provides AR-powered remote assistance and guidance to improve service outcomes.' }),
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <section className="relative py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl">🥽</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">AR/VR</h1>
          <div className="text-2xl text-gray-700 font-medium mb-6">Immersive experiences, training simulations</div>
          <p className="max-w-4xl mx-auto text-lg text-gray-600">Build immersive experiences across training, design, remote assist, and more.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#hardware" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 shadow-xl transition"><Grid size={18}/> Browse Categories</a>
            <a href="/compare" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-pink-600 text-pink-700 hover:bg-pink-600 hover:text-white transition"><GitCompare size={18}/> In-depth Tech Evaluations</a>
            <a href="/saved-new" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border text-gray-700 hover:bg-gray-50"><Heart size={18}/> View Saved Vendors</a>
          </div>
        </div>
      </section>
      {/* 1. AR/VR Hardware Companies */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-purple-700 font-semibold tracking-wide">AR/VR Hardware Companies</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="hardware" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hardwareVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. AR/VR Development Platforms & Tools */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-purple-700 font-semibold tracking-wide">AR/VR Development Platforms & Tools</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="tools" className="pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {toolsVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Enterprise Applications & Experiences */}
      <section className="pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            <div className="px-4 py-1 rounded-full bg-white border text-purple-700 font-semibold tracking-wide">Enterprise Applications & Experiences</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
          </div>
        </div>
      </section>
      <section id="enterprise" className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {enterpriseVendors.map(v => (
              <VendorCard key={v.id} v={v} saved={saved.has(v.id)} onToggleSave={()=> toggleSaveVendor(v)} onRequestDemo={()=> openDemo(v)} />
            ))}
          </div>
        </div>
      </section>
      <DemoRequestModal open={demoOpen} onClose={()=> setDemoOpen(false)} vendor={demoVendor} currentUser={currentUser} onSubmit={submitDemo} />
    </div>
  )
}

