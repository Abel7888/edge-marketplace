import { useState, useEffect } from 'react'
import { BookOpen, Download, CheckCircle2, Mail, User, Building, Phone, Network, Zap, AlertTriangle, TrendingUp } from 'lucide-react'

export default function AINetworking() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'The 2026 AI Networking Buyer\'s Guide - Free Download | Edge Marketplace'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Download The 2026 AI Networking Buyer\'s Guide: How to Scale Training Workloads, Eliminate Bottlenecks, and Avoid Multi-Million Dollar Architecture Mistakes. Expert insights for AI infrastructure.')
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
          resourceTitle: 'The 2026 AI Networking Buyer\'s Guide',
          requestType: 'Resource Download',
          timestamp: new Date().toISOString()
        })
      })

      setSubmitted(true)
      
      setTimeout(() => {
        window.open('https://drive.google.com/uc?export=download&id=1FtKPOAn8cthf7C1U_Go6isY4yg5oalqC', '_blank')
      }, 500)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl -ml-48 -mb-48" />
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-300 rounded-full px-4 py-2 mb-6">
                  <BookOpen className="text-orange-700" size={18} />
                  <span className="text-orange-800 font-bold text-sm uppercase tracking-wider">Free Guide</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                  The 2026 AI Networking Buyer's Guide
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 leading-tight">
                  How to Scale Training Workloads, Eliminate Bottlenecks, and Avoid Multi-Million Dollar Architecture Mistakes
                </h2>
                
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  A poorly designed AI network doesn't just slow down training—it transforms a $5 million GPU investment into a $2 million performing asset. The bottleneck isn't your accelerators. It's the fabric connecting them.
                </p>

                {/* Key Benefits */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Zap className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Eliminate Network Bottlenecks</h3>
                      <p className="text-gray-600 text-sm">Prevent training runs from stretching 2-3x longer due to network congestion and data transfer delays</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Avoid $3-5M Emergency Redesigns</h3>
                      <p className="text-gray-600 text-sm">Get your fabric architecture right the first time and avoid costly emergency fixes when scaling</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Maximize GPU Utilization</h3>
                      <p className="text-gray-600 text-sm">Keep GPU utilization above 85% instead of dropping to 60% because data can't reach accelerators fast enough</p>
                    </div>
                  </div>
                </div>

                {/* Guide Overview */}
                <div className="mt-8 p-6 rounded-2xl bg-white border-2 border-orange-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">The $10 Million Mistake Hiding in Your Network Architecture</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Here's the equation that separates successful AI deployments from expensive failures: A poorly designed AI network doesn't just slow down training—it transforms a $5 million GPU investment into a $2 million performing asset.
                  </p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Training runs stretching 2-3x longer than expected due to network congestion</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>GPU utilization dropping to 60% because data can't reach accelerators fast enough</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Emergency fabric redesigns costing $3-5 million when initial deployment should have been $1.5 million</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Vendor lock-in creating technical debt that blocks scaling for 3-5 years</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span>Competitive advantage evaporating as rivals deploy faster, more efficient infrastructure</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                  {submitted ? (
                    <div className="p-8 text-center">
                      <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-orange-600" size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Download Started!</h3>
                      <p className="text-gray-600 mb-6">
                        Your guide is downloading now. If it doesn't start automatically, click the button below.
                      </p>
                      <a
                        href="https://drive.google.com/uc?export=download&id=1FtKPOAn8cthf7C1U_Go6isY4yg5oalqC"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all"
                      >
                        <Download size={20} />
                        Download Again
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-orange-600 to-red-600 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">Get Your Free Guide</h3>
                        <p className="text-orange-100 text-sm">Enter your details to download instantly</p>
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
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
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
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
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
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
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
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Network Architecture Best Practices</h3>
                <p className="text-gray-700">Design principles for AI training fabrics that maximize GPU utilization and minimize latency bottlenecks.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Cost Optimization Strategies</h3>
                <p className="text-gray-700">How to avoid $3-5M emergency redesigns by getting your initial architecture right and planning for scale.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Performance Benchmarking</h3>
                <p className="text-gray-700">Real-world metrics showing the impact of network design on training speed, GPU efficiency, and total cost of ownership.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Vendor Selection Framework</h3>
                <p className="text-gray-700">How to evaluate networking vendors, avoid lock-in, and maintain flexibility as your AI infrastructure scales.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}
