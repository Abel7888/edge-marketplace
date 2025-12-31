'use client'


import { useState, useEffect } from 'react'
import { BookOpen, Download, CheckCircle2, Mail, User, Building, Phone, Shield, FileText, Scale, Clock } from 'lucide-react'

export default function HealthcareApproval() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'What Healthcare Providers Want Before Approving IT or Digital Health Solutions (2026) - Free Download | Edge Marketplace'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Download: What Healthcare Providers Want Before Approving IT or Digital Health Solutions (2026). A practical guide to real approval processes—procurement, security, compliance, EHR integration, and why deals stall late.'
      )
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
          resourceTitle: 'What Healthcare Providers Want Before Approving IT or Digital Health Solutions (2026)',
          requestType: 'Resource Download',
          timestamp: new Date().toISOString()
        })
      })

      setSubmitted(true)

      setTimeout(() => {
        window.open('https://drive.google.com/uc?export=download&id=1ZABIciDwM4M9kYpXP8WXzWGB9_SN-7UZ', '_blank')
      }, 500)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-100 border border-teal-300 rounded-full px-4 py-2 mb-6">
                <BookOpen className="text-teal-700" size={18} />
                <span className="text-teal-800 font-bold text-sm uppercase tracking-wider">Free Guide</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                What Healthcare Providers Want Before Approving IT or Digital Health Solutions (2026)
              </h1>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                This guide explains what healthcare providers actually need to see before approving IT or digital health solutions in 2026 — and why so many good products get stuck in procurement, legal, or security reviews.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Scale className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Who Has Veto Power</h3>
                    <p className="text-gray-600 text-sm">Procurement, legal, security, clinicians, and CFOs—what each stakeholder needs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Security, Compliance, Equity</h3>
                    <p className="text-gray-600 text-sm">HIPAA/state privacy, cybersecurity audits, bias review—no longer negotiable.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">What Causes Late-Stage Stalls</h3>
                    <p className="text-gray-600 text-sm">Documentation gaps, EHR integration risk, liability, and unclear ROI definitions.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-white border-2 border-teal-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3">A practical view of the real approval process.</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Instead of sales advice, the guide walks through financial modeling, EHR integration, privacy and FDA considerations, cybersecurity reviews, AI explainability, bias review, and legal negotiations.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The goal isn’t to help you pitch harder. It’s to help you show up prepared—with the evidence, transparency, and documentation healthcare organizations require before they’ll say yes.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                {submitted ? (
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="text-teal-600" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Download Started!</h3>
                    <p className="text-gray-600 mb-6">
                      Your guide is downloading now. If it doesn't start automatically, click the button below.
                    </p>
                    <a
                      href="https://drive.google.com/uc?export=download&id=1ZABIciDwM4M9kYpXP8WXzWGB9_SN-7UZ"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all"
                    >
                      <Download size={20} />
                      Download Again
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">Get Your Free Guide</h3>
                      <p className="text-teal-100 text-sm">Enter your details to download instantly</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="John Smith"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-sm font-semibold text-slate-900 mb-2">
                          Company *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            id="company"
                            required
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="Acme Inc."
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                          Work Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                          Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Download size={20} />
                            Download Free Guide
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Clock size={14} />
                        <span>Instant download after submission</span>
                      </div>

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
    </div>
  )
}

