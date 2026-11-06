import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Cancellation, Refund & Complaints Policy | Quickfiss",
  description: "How cancellations, refunds, complaints and return visits are handled for Quickfiss bookings.",
};

const sections: LegalSection[] = [
  {
    title: "Purpose and scope",
    paras: [
      "This policy explains how cancellations, refunds, service complaints and return visits are handled for bookings made through the Quickfiss website or app in Nigeria.",
    ],
  },
  {
    title: "Cancelling a booking",
    bullets: [
      "Customer cancels at least 2 hours before the appointment (before work has started): prepaid amounts for the cancelled service are refunded, apart from any clearly disclosed, lawful and reasonable third-party or specially ordered cost you approved in advance.",
      "Customer cancels less than 2 hours before: a reasonable cancellation or call-out charge applies only if it was clearly shown before booking and the provider has reasonably reserved time, travelled or been dispatched. No hidden or arbitrary fee is applied, any unused balance is refunded, and if no provider was dispatched and no cost incurred there is no dispatch fee.",
      "Provider cancels, does not attend within the agreed window without reasonable notice, or cannot do the job for a reason attributable to the provider or Quickfiss: you may choose to reschedule or be refunded, and no cancellation fee is charged to you.",
      "Genuine emergencies and exceptional circumstances are reviewed fairly, taking into account costs actually incurred, what was disclosed at booking and Nigerian consumer-protection law.",
    ],
  },
  {
    title: "Charges when a service has started",
    paras: [
      "Once work has begun, you may be charged for work actually performed, time reasonably spent and materials supplied or bought with your approval. Before work goes beyond the original scope, the provider must explain the extra work and price and get your approval, preferably in the app.",
    ],
    bullets: [
      "If a provider diagnoses a fault but cannot complete the repair (outside their competence, needs utility intervention, or unavailable parts), a disclosed attendance or diagnostic fee may be payable. It must be explained before booking or before chargeable diagnostic work.",
      "If you decline a proposed repair after diagnosis, only the disclosed diagnostic or attendance fee and authorised work or materials already provided may be charged.",
      "If the provider cannot work because agreed access, essential equipment, safe conditions or accurate job information was not provided, a disclosed and reasonable attendance fee may apply.",
      "Any after-hours, weekend, emergency, transport, call-out or diagnostic surcharge must be disclosed before you confirm the booking.",
    ],
  },
  {
    title: "“No fix, no fee”",
    paras: [
      "A “no fix, no fee” offer applies only where the individual service listing or booking expressly says so. Unless the listing says otherwise it applies to eligible household customers only, not business or commercial bookings. The listing must explain exclusions, including disclosed attendance or diagnostic fees, authorised parts or materials, unsafe or inaccessible conditions, faults outside the provider's scope and cases where you decline the recommended repair. Nothing here removes non-waivable legal rights.",
    ],
  },
  {
    title: "Requesting a refund",
    paras: [
      `Request a refund from your booking page or by contacting ${COMPANY.supportEmail}. Include the booking reference, the reason and any evidence (messages, photos, the provider's report, a receipt). Quickfiss will acknowledge the request and may ask both sides for more information before deciding.`,
    ],
    bullets: [
      "Approved refunds are returned to the original payment method where the payment provider and channel support it. A refund is treated as initiated when Quickfiss or the payment provider confirms submission; your bank or card issuer may take additional time to post it.",
      "Quickfiss aims to submit an approved refund within five (5) business days after the decision and any required payment-provider checks. This is a processing target, not a guarantee of your bank's posting date. You will be told if the payment provider reports a delay.",
      "Wallet credit is offered as an alternative only if you actively choose it. You will not be forced to accept a wallet balance instead of a refund to your original method where that is available.",
    ],
  },
  {
    title: "Completion, payout release and disputes",
    paras: [
      "After a provider marks a job complete, Quickfiss notifies you and gives you a way to confirm completion or report a problem. Provider payout may be released automatically if you neither confirm nor raise a dispute within forty-eight (48) hours of the completion notice. A dispute raised in that window pauses any unsettled payout while Quickfiss reviews the evidence.",
      "The 48-hour rule is an operational deadline for the initial platform review. It does not extinguish statutory consumer rights, your right to complain about a later-discovered issue, or any warranty offered for the service or parts. If payout has already been made, Quickfiss may still investigate, request remedial work, facilitate a negotiated refund or pursue other available remedies.",
    ],
  },
  {
    title: "Complaints and return visits",
    paras: [
      "Report a problem as soon as possible through the booking page or by email. Quickfiss may arrange a return visit with the original provider or another suitable provider.",
    ],
    bullets: [
      "If the problem arose directly from the original work and is within the original agreed scope, Quickfiss will review whether a return visit or correction can be made without extra labour charge.",
      "If the issue is unrelated, caused by misuse, later damage, third-party equipment or a utility problem, you may be quoted for new work before it starts.",
      "No return visit, replacement part or additional work is free unless the listing, the provider's written warranty or a Quickfiss decision says so. Any charge must be disclosed and approved in advance.",
      "Providers must not threaten or retaliate against customers who make a genuine complaint, and customers must not make knowingly false claims.",
    ],
  },
  {
    title: "Goods and materials",
    paras: [
      "Where physical goods are sold through the platform, you may request a return within five (5) days of delivery for an unused, unopened item, subject to disclosed and lawful product-specific exceptions. This does not limit stronger statutory rights for defective, unsafe or misdescribed goods. Specially ordered, installed or used items and consumables are assessed case by case. For defective or incomplete goods, contact Quickfiss promptly with the order reference and evidence.",
    ],
  },
  {
    title: "Contact and escalation",
    paras: [
      `Support: ${COMPANY.supportEmail}. Telephone: ${COMPANY.phone}. ${COMPANY.name}, ${COMPANY.address}. Quickfiss aims to acknowledge complaints within two (2) business days and provide updates where a case needs further investigation.`,
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalDocument
      title="Cancellation, Refund & Complaints Policy"
      intro="For customers booking local professionals and handymen through Quickfiss."
      sections={sections}
    />
  );
}
