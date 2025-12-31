'use client'


import { useState, useEffect } from 'react'
import { BookOpen, Download, CheckCircle2, Mail, User, Building, Phone, TrendingUp, DollarSign, BarChart3 } from 'lucide-react'

export default function InstitutionalCapital() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'The 2026 Multifamily Tech Buyer\'s Guide - Free Download | Edge Marketplace'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Download The 2026 Multifamily Tech Buyer\'s Guide: How to Protect NOI, Drive Property Value, and Win with Institutional Capital. Strategic framework for technology investment with documented ROI.')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          resourceType: 'guide',
          resourceTitle: 'The 2026 Multifamily Tech Buyer\'s Guide',
          requestType: 'Resource Download',
          timestamp: new Date().toISOString()
        })
      })

      setSubmitted(true)
      
      setTimeout(() => {
        window.open('https://drive.google.com/uc?export=download&id=1eOukTqHoM9Gn-BsA6XZypK5R2pVUFTsh', '_blank')
      }, 500)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -ml-48 -mb-48" />
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-full px-4 py-2 mb-6">
                  <BookOpen className="text-emerald-700" size={18} />
                  <span className="text-emerald-800 font-bold text-sm uppercase tracking-wider">Free Guide</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                  The 2026 Multifamily Tech Buyer's Guide
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-600 mb-6 leading-tight">
                  How to Protect NOI, Drive Property Value, and Win with Institutional Capital
                </h2>
                
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  A comprehensive framework for evaluating, selecting, and implementing technology solutions that deliver documented returns on investment. Real-world case studies, verified financial outcomes, and deployment lessons from properties ranging from 100 to 1,000+ units.
                </p>

                {/* Key Benefits */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Documented NOI Impact</h3>
                      <p className="text-gray-600 text-sm">Verified cost savings and revenue increases with specific payback periods and property value implications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Risk Mitigation Framework</h3>
                      <p className="text-gray-600 text-sm">Prevent catastrophic failures with quantified financial exposure analysis</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Strategic Capital Allocation</h3>
                      <p className="text-gray-600 text-sm">Business outcomes focused on NOI impact, scalability, integration, and user adoption</p>
                    </div>
                  </div>
                </div>

                {/* Guide Overview */}
                <div className="mt-8 p-6 rounded-2xl bg-white border-2 border-emerald-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">What Makes This Guide Different</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    The multifamily technology landscape has matured significantly. What was once experimental is now proven. What was once optional is now expected by institutional capital. The question is no longer <em>whether</em> to invest in smart property technology—it's <em>how</em> to deploy it strategically for measurable business outcomes.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Rather than focusing on technical specifications or feature comparisons, this guide emphasizes business outcomes—NOI impact, risk mitigation, scalability, integration capability, and user adoption. Every recommendation is supported by documented evidence from actual deployments with verified financial results.
                  </p>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                  {submitted ? (
                    <div className="p-8 text-center">
                      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-600" size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Download Started!</h3>
                      <p className="text-gray-600 mb-6">
                        Your guide is downloading now. If it doesn't start automatically, click the button below.
                      </p>
                      <a
                        href="https://drive.google.com/uc?export=download&id=1eOukTqHoM9Gn-BsA6XZypK5R2pVUFTsh"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all"
                      >
                        <Download size={20} />
                        Download Again
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Download size={24} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">Download Your Free Guide</h2>
                            <p className="text-emerald-100 text-sm">Instant access - no credit card required</p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="p-8">
                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                placeholder="John Doe"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Company <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                placeholder="Acme Corporation"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Corporate Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                placeholder="john@company.com"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Phone <span className="text-gray-400 text-xs">(Optional)</span>
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                placeholder="+1 (555) 123-4567"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {submitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Download size={20} />
                              Download Free Guide
                            </>
                          )}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                          By downloading, you agree to receive occasional emails about our services. Unsubscribe anytime.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Learn Section */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">What You'll Learn</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Strategic Technology Investment Framework</h3>
                <p className="text-gray-700">Establishes the business case for technology investment, including market context, financial drivers, and competitive dynamics shaping multifamily operations in 2026.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Outcome-Focused Evaluation Criteria</h3>
                <p className="text-gray-700">Five critical questions to determine whether a technology solution merits consideration, focusing on documented NOI impact and risk mitigation.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Real-World Case Studies</h3>
                <p className="text-gray-700">Verified financial outcomes from actual deployments across 100 to 1,000+ unit properties in diverse markets with documented ROI.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Property Valuation & Competitive Positioning</h3>
                <p className="text-gray-700">How top-quartile operators approach technology as strategic capital allocation that impacts valuations, tenant retention, and institutional investor appeal.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}

