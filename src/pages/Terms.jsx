import React from 'react'

export default function Terms() {
  return (
    <main className="bg-white text-[#1A1A2E] py-16">
      <section className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0F1B3C]">Terms of Service</h1>
        <p className="mt-4 leading-7">
          By using Edge Marketplace, you agree to our terms. We provide the platform "as is" and may update features, policies, and terms over time. You agree to use the site lawfully and respect intellectual property rights.
        </p>
        <h2 className="mt-8 text-xl font-semibold">Use of Service</h2>
        <ul className="mt-2 list-disc pl-6 space-y-2">
          <li>No unlawful, harmful, or abusive activity</li>
          <li>No attempts to disrupt, reverse engineer, or misuse the platform</li>
          <li>Provide accurate information when requested</li>
        </ul>
        <h2 className="mt-8 text-xl font-semibold">Vendor & Talent Content</h2>
        <p className="mt-2 leading-7">Vendors and partners are responsible for the accuracy of their listings and claims. We may remove content that violates policies or legal requirements.</p>
        <h2 className="mt-8 text-xl font-semibold">Disclaimers & Liability</h2>
        <p className="mt-2 leading-7">We do not guarantee outcomes or results. To the fullest extent permitted by law, Edge Marketplace is not liable for indirect or consequential damages.</p>
        <h2 className="mt-8 text-xl font-semibold">Contact</h2>
        <p className="mt-2 leading-7">For questions about these terms, please contact us.</p>
      </section>
    </main>
  )
}
