import React from 'react'

export default function Privacy() {
  return (
    <main className="bg-white text-[#1A1A2E] py-16">
      <section className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0F1B3C]">Privacy Policy</h1>
        <p className="mt-4 leading-7">
          We only collect information necessary to provide and improve Edge Marketplace. This includes basic usage data, cookies required for security, authentication, and essential site functionality.
        </p>
        <h2 className="mt-8 text-xl font-semibold">What We Collect</h2>
        <ul className="mt-2 list-disc pl-6 space-y-2">
          <li>Essential cookies for login, session management, and security</li>
          <li>Basic analytics (page views, device/browser info) to improve the product</li>
          <li>Information you choose to submit (e.g., forms, signups)</li>
        </ul>
        <h2 className="mt-8 text-xl font-semibold">How We Use Data</h2>
        <ul className="mt-2 list-disc pl-6 space-y-2">
          <li>Operate and secure the platform</li>
          <li>Improve user experience and site performance</li>
          <li>Respond to support requests and communicate service updates</li>
        </ul>
        <h2 className="mt-8 text-xl font-semibold">Your Choices</h2>
        <p className="mt-2 leading-7">You can control cookies in your browser settings. Essential cookies are required for the site to function. For questions, contact us.</p>
      </section>
    </main>
  )
}
