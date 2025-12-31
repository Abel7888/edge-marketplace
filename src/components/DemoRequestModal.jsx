import { useState } from 'react'
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle2, Sparkles, X } from 'lucide-react'

export default function DemoRequestModal({ open, onClose, vendor, currentUser, onSubmit }){
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    company: '',
    role: '',
    phoneNumber: '',
    goals: '',
    features: '',
    timeframe: 'This Week',
    preferredDays: [],
    preferredTimes: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    additionalNotes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  if (!open) return null

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }))
  }

  async function handleSubmit(e){
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send to Formspree
      const response = await fetch('https://formspree.io/f/mwpjjkav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'Live Demo Request',
          vendorId: vendor?.id,
          vendorName: vendor?.name,
          vendorCategory: vendor?.category,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          role: formData.role,
          phoneNumber: formData.phoneNumber,
          goals: formData.goals,
          features: formData.features,
          timeframe: formData.timeframe,
          preferredDays: formData.preferredDays.join(', '),
          preferredTimes: formData.preferredTimes.join(', '),
          timezone: formData.timezone,
          additionalNotes: formData.additionalNotes,
          submittedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Formspree submission failed')
      }

      // Also call the original onSubmit if provided
      if (onSubmit) {
        await onSubmit({
          vendorId: vendor?.id,
          vendorName: vendor?.name,
          ...formData
        })
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        onClose()
        setSubmitSuccess(false)
        setFormData({
          name: currentUser?.displayName || '',
          email: currentUser?.email || '',
          company: '',
          role: '',
          phoneNumber: '',
          goals: '',
          features: '',
          timeframe: 'This Week',
          preferredDays: [],
          preferredTimes: [],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          additionalNotes: ''
        })
      }, 2000)
    } catch (error) {
      console.error('Error submitting demo request:', error)
      alert('Failed to submit demo request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const times = ['Morning (9am-12pm)', 'Afternoon (12pm-3pm)', 'Late Afternoon (3pm-6pm)']

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal onClick={onClose}>
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={24} />
                <h2 className="text-2xl font-bold">Request Live Demo</h2>
              </div>
              <p className="text-blue-100">{vendor?.name}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
              <X size={20} />
            </button>
          </div>
        </div>

        {submitSuccess ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Demo Request Submitted!</h3>
            <p className="text-gray-600">We'll coordinate with {vendor?.name} and get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Your Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={e => handleChange('company', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={e => handleChange('role', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="CTO, Product Manager, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={e => handleChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Demo Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-600" />
                Demo Details
              </h3>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">What are your goals for this demo? *</label>
                <textarea
                  required
                  value={formData.goals}
                  onChange={e => handleChange('goals', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all resize-none"
                  placeholder="e.g., Evaluate features for our team, understand pricing, see integration capabilities..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Which features interest you most?</label>
                <textarea
                  value={formData.features}
                  onChange={e => handleChange('features', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all resize-none"
                  placeholder="List specific features or capabilities you'd like to see..."
                />
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={20} className="text-blue-600" />
                Your Availability
              </h3>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Preferred Timeframe *</label>
                <div className="flex flex-wrap gap-2">
                  {['This Week', 'Next Week', 'Next 2 Weeks', 'Flexible'].map(tf => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => handleChange('timeframe', tf)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        formData.timeframe === tf
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Preferred Days (Select all that work)</label>
                <div className="flex flex-wrap gap-2">
                  {days.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleArrayItem('preferredDays', day)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        formData.preferredDays.includes(day)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Preferred Times (Select all that work)</label>
                <div className="flex flex-wrap gap-2">
                  {times.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => toggleArrayItem('preferredTimes', time)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        formData.preferredTimes.includes(time)
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Clock size={14} className="inline mr-1" />
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Your Timezone</label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={e => handleChange('timezone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  placeholder="Auto-detected"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Additional Notes (Optional)</label>
              <textarea
                value={formData.additionalNotes}
                onChange={e => handleChange('additionalNotes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all resize-none"
                placeholder="Any specific questions or requirements we should know about?"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Request Demo
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
