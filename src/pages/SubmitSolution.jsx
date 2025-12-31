'use client'


import { useState } from 'react'

import { useRouter } from 'next/navigation'

export default function SubmitSolution(){
  const router = useRouter()
  const [form, setForm] = useState({
    company: '',
    website: '',
    technology: '',
    industry: '',
    solution: '',
    project: ''
  })
  const [submitted, setSubmitted] = useState(false)

  async function submit(e){
    e.preventDefault()
    try {
      const response = await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      if (response.ok) {
        setSubmitted(true)
        setForm({
          company: '',
          website: '',
          technology: '',
          industry: '',
          solution: '',
          project: ''
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error submitting your form. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <button 
          onClick={()=> navigate(-1)} 
          className="inline-flex items-center gap-1 text-sm sm:text-base text-blue-700 hover:text-blue-800 font-medium transition-colors"
        >
          ← Back
        </button>
        
        <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Submit Your Solution
        </h1>
        
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
          Vendors can list their solutions here. Share your technology, industry focus, solution, and a representative project. We will review and follow up.
        </p>
        
        {submitted && (
          <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-green-50 border-2 border-green-200 rounded-xl">
            <p className="text-sm sm:text-base text-green-800 font-semibold leading-relaxed">
              ✓ Thank you! Your solution has been submitted successfully. We'll review it and get back to you soon.
            </p>
          </div>
        )}
        
        <form onSubmit={submit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Company *
            </label>
            <input 
              value={form.company} 
              onChange={e=> setForm(f=>({...f, company:e.target.value}))} 
              className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors" 
              placeholder="Company name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Company Website *
            </label>
            <input 
              value={form.website} 
              onChange={e=> setForm(f=>({...f, website:e.target.value}))} 
              type="url"
              className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors" 
              placeholder="https://..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Technology *
            </label>
            <input 
              value={form.technology} 
              onChange={e=> setForm(f=>({...f, technology:e.target.value}))} 
              className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors" 
              placeholder="e.g., IoT, Digital Twin, AI, ML, Edge, AR/VR"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Industry *
            </label>
            <input 
              value={form.industry} 
              onChange={e=> setForm(f=>({...f, industry:e.target.value}))} 
              className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors" 
              placeholder="e.g., Real Estate, Manufacturing, Healthcare"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Solution Summary *
            </label>
            <textarea 
              value={form.solution} 
              onChange={e=> setForm(f=>({...f, solution:e.target.value}))} 
              className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors resize-none" 
              rows={4} 
              placeholder="Briefly describe the solution you provide"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Representative Project
            </label>
            <textarea 
              value={form.project} 
              onChange={e=> setForm(f=>({...f, project:e.target.value}))} 
              className="w-full border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-blue-500 focus:outline-none transition-colors resize-none" 
              rows={3} 
              placeholder="Share a relevant project or case study (optional)"
            />
          </div>
          
          <div className="pt-2 sm:pt-4">
            <button 
              type="submit" 
              className="w-full sm:w-auto min-w-[200px] h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base font-semibold hover:shadow-xl transition-all"
            >
              Submit Solution
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

