import React from 'react'

export default function Cookies() {
  return (
    <main className="bg-white text-[#1A1A2E] py-16">
      <section className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0F1B3C]">Cookie Policy</h1>
        <p className="mt-4 leading-7">
          We use cookies that are strictly necessary for the operation and security of Edge Marketplace, and basic analytics to improve the product. You can manage cookies in your browser settings.
        </p>
        <h2 className="mt-8 text-xl font-semibold">Types of Cookies</h2>
        <ul className="mt-2 list-disc pl-6 space-y-2">
          <li>Essential: Required for login, session management, and security</li>
          <li>Preferences: Save your settings (e.g., theme or language)</li>
          <li>Analytics: Basic usage metrics to help us improve features and performance</li>
        </ul>
        <h2 className="mt-8 text-xl font-semibold">Managing Cookies</h2>
        <p className="mt-2 leading-7">
          Most browsers allow control of cookies via settings. Blocking essential cookies may impact site functionality. For questions, contact us.
        </p>
      </section>
    </main>
  )
}
