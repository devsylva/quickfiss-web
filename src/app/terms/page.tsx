import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Terms & Conditions | Quickfiss",
  description: "Terms for customers and providers using the Quickfiss neighbourhood-professional marketplace.",
};

const sections: LegalSection[] = [
  {
    title: "About Quickfiss and acceptance",
    paras: [
      `By creating an account, booking a service, applying to become a provider or using the platform, you agree to these Terms, the Privacy Policy and the Booking Cancellation, Refund and Complaints Policy. If you do not agree, do not use the relevant service. These Terms do not exclude consumer rights that cannot lawfully be waived under Nigerian law.`,
    ],
  },
  {
    title: "What the platform does",
    paras: [
      "Quickfiss helps customers discover, contact and book independent local professionals and handymen. Depending on the feature, Quickfiss supports provider onboarding, identity review, booking administration, payment collection through a third-party payment provider, conditional settlement, reviews and support.",
      "Quickfiss is a marketplace intermediary, not the employer of each provider and not the direct performer of each service. A service contract is generally between the customer and the provider who accepts the booking. Identity review or a platform profile is not a guarantee of a provider's skills, conduct, availability or outcome.",
    ],
  },
  {
    title: "Eligibility and accounts",
    bullets: [
      "You must be at least 18 years old to create an account or apply as a provider, and must provide accurate, current and complete information.",
      "Keep your password and one-time codes confidential and tell us promptly if you suspect unauthorised access.",
      "Do not impersonate another person, falsify identity or qualifications, create duplicate accounts to evade restrictions, manipulate reviews or access another user's data.",
      "Quickfiss may request reasonable verification information to protect users, meet legal or payment-provider requirements or prevent fraud. A provider may not accept paid jobs until the required checks are approved.",
    ],
  },
  {
    title: "Provider responsibilities",
    bullets: [
      "Describe your services, experience, qualifications, service area, availability, pricing, call-out or diagnostic fees and materials costs accurately. Do not advertise a qualification, licence or capability you do not hold.",
      "Hold the licences, permits, insurance or trade registrations your work and location require. Refuse work outside your competence or where the site is unsafe.",
      "Attend on time or promptly tell the customer and Quickfiss if delayed or unable to attend. Do not begin additional work or incur material costs outside the approved scope without the customer's approval.",
      "Do not demand undisclosed cash, off-platform payments, unrelated personal data or bribes.",
      "Provider plans, platform commission, payout requirements and verification rules are shown in the provider dashboard or checkout and apply once accepted.",
    ],
  },
  {
    title: "Customer responsibilities",
    bullets: [
      "Provide an accurate job description, service address, contact details, access instructions and relevant information about the property, equipment or system.",
      "Make sure the provider can safely access the work area and tell them about known hazards, vulnerable occupants, animals or electrical isolation needs.",
      "Review the scope and total price before confirming. Ask about attendance fees, diagnostic fees, parts, additional labour, transport and after-hours rates before work starts.",
      "Treat providers respectfully and do not request illegal work, unsafe shortcuts, harassment or discriminatory conduct.",
    ],
  },
  {
    title: "Listings, bookings and prices",
    paras: [
      "A listing, quote or available appointment is an invitation to book, subject to confirmation and provider availability. A booking is confirmed when the platform displays or sends a confirmation. If a provider proposes a change in scope or price, the customer must approve it before the additional work begins.",
      "Prices are shown in Nigerian naira (₦). The platform shows the total amount payable, including any mandatory platform or booking fees and disclosed taxes, before you pay. Any attendance charge, diagnostic fee, after-hours premium, travel fee or other compulsory fee must be disclosed before confirmation. A provider must not charge more than the agreed amount for the approved scope without your consent.",
    ],
  },
  {
    title: "Payments, provider payouts and refunds",
    paras: [
      "Payments are processed through Paystack or another payment provider identified at checkout, subject to that provider's terms and security controls. Quickfiss uses payment-provider records to reconcile payments, refunds and payouts.",
      "Quickfiss coordinates conditional settlement to a provider after completion is confirmed, or after a 48-hour completion-review period ends without a dispute. This is a platform payment workflow and is not a promise that Quickfiss operates a regulated escrow service.",
      "If you report a problem within the 48-hour review window after a completion notice, Quickfiss may pause an unsettled provider payout while it reviews the evidence, and will tell both parties the decision and next steps. Release of payment does not remove statutory consumer rights or bar a later complaint about a defect.",
      "Refunds and cancellations are governed by the Booking Cancellation, Refund and Complaints Policy. Approved refunds are returned to the original payment method where supported. Wallet credit is offered only if you actively choose it.",
    ],
  },
  {
    title: "Provider plans and platform commission",
    paras: [
      "The plan name, features, amount, duration, commission rate and expiry behaviour are shown before purchase. Current plans: Free (₦0, 10% platform commission); Standard (₦5,000 per 30 days, 8% commission); Premium (₦15,000 per 30 days, 5% commission). Paid plans do not auto-renew; a provider must renew deliberately to continue.",
      "Quickfiss may change future plan prices or features with advance notice. A promotion or paid service boost will be offered only after its cost, duration and effect are clearly disclosed.",
    ],
  },
  {
    title: "Completion, complaints and dispute handling",
    paras: [
      "Customers should inspect completed work where safe and practical, confirm completion or report a problem in the platform, and keep relevant records. Quickfiss may request evidence from both sides, including messages, photos, quotes, receipts or an independent report, and will seek to make a fair, evidence-based decision. A platform decision does not replace any right or remedy available through a court, regulator or other lawful process.",
      "Quickfiss aims to acknowledge complaints within two (2) business days and give updates on complex matters. Depending on the outcome, Quickfiss may issue a warning, require further work where agreed, issue an eligible refund, hold or reverse an unpaid settlement where legally and technically possible, or suspend an account.",
    ],
  },
  {
    title: "Safety and prohibited conduct",
    bullets: [
      "Do not use Quickfiss for illegal activity, fraud, threats, harassment, discrimination, theft or attempts to bypass safety rules.",
      "Quickfiss is not an emergency service. For fire, electric shock, gas leak or any life-threatening situation, move to safety and contact the relevant emergency or utility service.",
      "Do not upload malware, bypass security, scrape personal data or access records that do not belong to you.",
      "Quickfiss may investigate credible safety or fraud reports, restrict a booking, suspend an account or share information where lawful and necessary.",
    ],
  },
  {
    title: "Reviews and content",
    paras: [
      "Reviews must be honest and based on actual experience, and must not contain threats, unlawful content, personal data you are not entitled to share or knowingly false claims. You keep ownership of content you submit, and grant Quickfiss a non-exclusive, royalty-free licence to host and display it for platform operation, safety and marketing of the relevant service, subject to the Privacy Policy.",
    ],
  },
  {
    title: "Availability, third parties and updates",
    paras: [
      "We use reasonable efforts to keep the platform available and secure, but service may be interrupted for maintenance, faults, network issues, payment-provider outages or circumstances outside our control. Third-party payment, messaging, hosting and verification services have their own terms and availability.",
    ],
  },
  {
    title: "Intellectual property",
    paras: [
      "Quickfiss and its licensors own the platform software, brand, logo and design, except for third-party materials and user content. You may not copy, commercially exploit, reverse engineer or redistribute them, or use Quickfiss branding without permission, except where the law allows.",
    ],
  },
  {
    title: "Suspension and termination",
    paras: [
      "You may stop using the platform and ask support to close your account, subject to open bookings, payment reconciliation, legal retention duties and ongoing disputes. Quickfiss may restrict, suspend or terminate access for material breach, fraud, unsafe conduct, misuse or legal requirements, and will give notice and a chance to respond where appropriate. Closure does not cancel outstanding payment obligations or rights that already arose.",
    ],
  },
  {
    title: "Responsibility and limitations",
    paras: [
      "Each provider is responsible for performing the service they accepted, for the accuracy of their qualifications and listing, and for complying with the laws that apply to their trade. Customers remain responsible for accurate job information and following reasonable safety instructions.",
      "Nothing in these Terms excludes or limits liability that cannot lawfully be excluded, including statutory consumer protections and liability for fraud or negligence. Subject to that, Quickfiss is responsible for its own acts and omissions and does not guarantee the outcome of every independent provider's work. Raise any claim about a provider's work promptly through the platform.",
    ],
  },
  {
    title: "Privacy",
    paras: [
      "The Privacy Policy explains how Quickfiss handles personal data. Contact and service-address details are shared between customer and provider only as needed to arrange, perform, support or dispute a booking, or as required by law.",
    ],
  },
  {
    title: "Changes to these Terms",
    paras: [
      "We may update these Terms and will show the current version and effective date. We will give notice of material changes where required; changes do not retrospectively remove accrued or non-waivable statutory rights.",
    ],
  },
  {
    title: "Governing law and contact",
    paras: [
      "These Terms are governed by the laws of the Federal Republic of Nigeria, subject to mandatory consumer-protection and other applicable laws. Disputes may be referred to the competent Nigerian courts or relevant regulator, and nothing here prevents a consumer from using a statutory complaint or redress process.",
      `Support: ${COMPANY.supportEmail}. Privacy / data requests: ${COMPANY.privacyEmail}, subject "${COMPANY.privacySubject}". ${COMPANY.name}, ${COMPANY.address}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms & Conditions"
      intro="Terms for customers and providers using the Quickfiss neighbourhood-professional marketplace."
      sections={sections}
    />
  );
}
