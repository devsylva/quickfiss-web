import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ShieldTick } from "iconsax-react";

export const metadata = {
  title: "Privacy Policy | Quickfiss",
  description: "Read Quickfiss's comprehensive privacy policy regarding data collection, KYC processing, and escrow security.",
};

export default function PrivacyPage() {
  const lastUpdated = "September 30, 2026";

  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-primary-light selection:text-primary">
      <LandingNavbar />

      <main className="py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          {/* Header */}
          <div className="border-b border-border/80 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldTick size={16} color="#059669" variant="Bold" />
              <span>NDPR & GDPR Compliant</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs text-muted">Last updated: {lastUpdated}</p>
          </div>

          {/* Legal Content */}
          <div className="prose prose-zinc mt-10 max-w-none text-sm leading-relaxed text-zinc-600">
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
              <p className="mt-2">
                Quickfiss Technologies Inc. (&ldquo;Quickfiss&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your personal data and respecting your privacy. This Privacy Policy describes how we collect, use, process, and disclose your information in connection with your access to and use of the Quickfiss web applications, mobile platforms, and escrow billing services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
              <p className="mt-2">We collect information that you provide directly to us when creating an account, undergoing KYC verification, or booking a service:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li><strong>Account Information:</strong> Your email address, password hashes, and user role (Customer or Artisan).</li>
                <li><strong>Client Profile Data:</strong> Full name, verified telephone number, primary residential address, and geolocation coordinates.</li>
                <li><strong>Artisan KYC Data:</strong> Government identification documents (National Identification Number [NIN], International Passport, or Driver&rsquo;s License), biometric proof of identity, business registration documents, utility bills for proof of address, and trade certifications.</li>
                <li><strong>Booking & Communication Records:</strong> Task descriptions, address of service, schedule, in-app chat messages, uploaded photos/videos of repairs, and mutual reviews.</li>
                <li><strong>Financial & Payment Information:</strong> Payment transactions are tokenized and processed via Paystack (PCI-DSS Level 1 certified). We do not store raw credit/debit card numbers or CVVs on our servers. We store wallet balances, transaction references, and bank account details for artisan payouts.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">3. How We Use Your Information</h2>
              <p className="mt-2">We use the personal information collected to:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Enable customers to discover, communicate with, and hire verified artisans nearby.</li>
                <li>Conduct mandatory background verification and fraud prevention checks.</li>
                <li>Operate the Paystack milestone escrow payment mechanism and process instant wallet withdrawals.</li>
                <li>Facilitate in-app messaging, job status tracking, and dispute resolution.</li>
                <li>Maintain the safety, integrity, and operational security of our marketplace.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">4. Sharing and Disclosure</h2>
              <p className="mt-2">
                We do not sell, rent, or trade your personal information to third parties. We share information only under the following strictly defined conditions:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li><strong>Between Customers and Artisans:</strong> Once a booking is initiated, service address and contact details are shared between the parties to facilitate task execution.</li>
                <li><strong>Payment Processors:</strong> Necessary transaction data is shared with licensed financial partners (Paystack) to process deposits and payouts.</li>
                <li><strong>Legal Compliance:</strong> When required by Nigerian law, court orders, or government regulatory bodies to investigate fraud or safety emergencies.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">5. Data Security & Storage</h2>
              <p className="mt-2">
                We employ industry-standard encryption protocols (TLS/SSL in transit, AES-256 at rest) to safeguard your sensitive documents and credentials. Access to verification files is restricted to authorized compliance officers on a need-to-know basis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">6. Your Rights</h2>
              <p className="mt-2">
                Under the Nigeria Data Protection Act (NDPA) and applicable regulations, you have the right to access, rectify, or request the deletion of your personal information, subject to mandatory anti-money laundering (AML) and financial record-keeping laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">7. Contact the Data Protection Officer</h2>
              <p className="mt-2">
                If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact our Data Protection Office at:
              </p>
              <div className="mt-3 rounded-2xl bg-zinc-50 p-4 border border-border">
                <p className="font-semibold text-foreground">Data Protection Officer &mdash; Quickfiss Technologies Inc.</p>
                <p className="text-xs text-muted">Email: privacy@quickfiss.com</p>
                <p className="text-xs text-muted">Address: 14 Adeola Odeku Street, Victoria Island, Lagos, Nigeria</p>
              </div>
            </section>
          </div>

          <div className="mt-12 border-t border-border pt-6 flex justify-between text-xs text-muted">
            <Link href="/terms" className="hover:text-primary transition-colors">
              &larr; Read Terms of Service
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Back to Home &rarr;
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
