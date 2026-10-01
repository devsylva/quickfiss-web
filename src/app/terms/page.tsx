import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Card } from "iconsax-react";

export const metadata = {
  title: "Terms of Service | Quickfiss",
  description: "Read the Terms of Service governing the use of Quickfiss marketplace, artisan services, and escrow payments.",
};

export default function TermsPage() {
  const lastUpdated = "September 30, 2026";

  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-primary-light selection:text-primary">
      <LandingNavbar />

      <main className="py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          {/* Header */}
          <div className="border-b border-border/80 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
              <Card size={16} color="#3d5afe" variant="Bold" />
              <span>User Agreement & Escrow Terms</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-xs text-muted">Last updated: {lastUpdated}</p>
          </div>

          {/* Legal Content */}
          <div className="prose prose-zinc mt-10 max-w-none text-sm leading-relaxed text-zinc-600">
            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">1. Agreement to Terms</h2>
              <p className="mt-2">
                By creating an account, accessing, or using the Quickfiss platform (the &ldquo;Platform&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you may not access or use the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">2. The Quickfiss Platform Role</h2>
              <p className="mt-2">
                Quickfiss operates a technology marketplace connecting customers seeking repair, maintenance, and artisanal services with independent, verified service providers (&ldquo;Artisans&rdquo;). Quickfiss does not directly perform artisanal tasks; Artisans are independent third-party contractors and not employees or agents of Quickfiss.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">3. User Accounts & Verification (KYC)</h2>
              <p className="mt-2">
                You must provide accurate and complete information during registration. Artisans agree to undergo mandatory Know Your Customer (KYC) verification, including submitting valid government identity documents, proof of residential address, and professional references. Providing forged or misleading documents results in immediate account termination and reporting to relevant authorities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">4. Bookings & Escrow Payment System</h2>
              <p className="mt-2">To protect both parties, all payments on Quickfiss are governed by our Escrow Framework:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li><strong>Funding the Escrow:</strong> When a customer confirms a booking, the agreed service amount is paid through Paystack into an escrow holding account.</li>
                <li><strong>Holding Period:</strong> The artisan is notified that funds are secured. The funds remain locked and are not accessible by the artisan during the execution of work.</li>
                <li><strong>Completion & Release:</strong> Upon completion, the customer inspects the service and confirms satisfaction in the application. Once approved, the funds are immediately released into the artisan&rsquo;s wallet.</li>
                <li><strong>Prohibition of Off-Platform Cash:</strong> Paying or soliciting payments outside the Quickfiss platform violates these Terms, invalidates our insurance and satisfaction guarantee, and leads to immediate account suspension.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">5. Cancellations, Revisions & Refunds</h2>
              <p className="mt-2">
                Customers may cancel a booking without penalty before the artisan is dispatched or begins work. If a customer is unsatisfied with the delivered work, the customer must submit a dispute before confirming completion. Quickfiss will review chat logs, uploaded repair photos, and artisan documentation to adjudicate a fair resolution, revision, or partial/full refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">6. Artisan Responsibilities & Standards</h2>
              <p className="mt-2">
                Artisans agree to arrive punctually, perform tasks with reasonable skill and professional care, use quality materials agreed upon with the customer, and maintain respectful communication.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">7. Limitation of Liability</h2>
              <p className="mt-2">
                To the maximum extent permitted by applicable law, Quickfiss shall not be liable for indirect, incidental, special, or consequential damages resulting from the conduct or services provided by any artisan or customer on the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold text-foreground">8. Governing Law & Dispute Resolution</h2>
              <p className="mt-2">
                These Terms shall be governed and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising out of these Terms shall first be submitted to good-faith mediation conducted by Quickfiss Dispute Support in Lagos, Nigeria.
              </p>
            </section>
          </div>

          <div className="mt-12 border-t border-border pt-6 flex justify-between text-xs text-muted">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              &larr; Read Privacy Policy
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
