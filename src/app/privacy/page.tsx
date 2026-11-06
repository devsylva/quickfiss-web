import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Privacy Policy | Quickfiss",
  description: "How Quickfiss collects, uses, shares and protects personal data in Nigeria.",
};

const sections: LegalSection[] = [
  {
    title: "Who we are",
    paras: [
      `${COMPANY.name}, ${COMPANY.address}. Privacy and data requests: ${COMPANY.privacyEmail}, subject "${COMPANY.privacySubject}". General support uses the same mailbox.`,
    ],
  },
  {
    title: "Personal data we may collect",
    bullets: [
      "Account and identity details: name, email, phone number, profile photo, date of birth (providers), login preferences and account status.",
      "Customer booking details: service requested, address and location, appointment time, job description, photos or videos you submit, quotes, payment and cancellation history, ratings, reviews and complaint records.",
      "Provider verification details: contact and profile information, service categories, experience and qualifications, accepted identity-document information or images, proof of address and the verification outcome. We collect only the minimum needed for verification and safety.",
      "Payment and payout details: transaction reference, amount, status, refund details, and a provider's bank account name and number. Card details are handled directly by our payment provider; Quickfiss does not store full card numbers or CVV.",
      "Communications: messages sent through the platform, support requests and feedback.",
      "Technical and usage data: IP address, device and browser type, approximate location, pages visited, timestamps, cookies or similar identifiers, error reports and security logs.",
    ],
  },
  {
    title: "Why we use personal data",
    bullets: [
      "To create and operate accounts (contract; legitimate interest in secure account management).",
      "To match and deliver bookings (contract; legitimate interest in a safe and functional marketplace).",
      "To verify providers and protect users (contract, legitimate interests, legal obligation where applicable).",
      "To collect payment and pay providers, including refunds and disputes (contract, legal and accounting obligations, fraud prevention).",
      "To provide customer support and resolve disputes.",
      "To operate, secure and improve the platform.",
      "To comply with law and protect rights and safety.",
    ],
    afterBullets: [
      "We will explain any materially different use and seek consent where required. Optional marketing is never a condition of using core booking services.",
    ],
  },
  {
    title: "Location data and service matching",
    paras: [
      "A customer may need to provide a service address so a provider can attend. Where the app asks for device location, we explain why and ask for permission. You can deny it and choose a location manually. We disclose your booking address only to the provider selected for the job and to staff or service providers who need it to operate, support or safeguard that booking.",
    ],
  },
  {
    title: "Who we share personal data with",
    bullets: [
      "Assigned providers and customers: only what is reasonably needed to arrange, perform, confirm or dispute a booking.",
      "Payment providers, including Paystack or a replacement: payment processing, receipts, fraud checks, refunds and provider payouts.",
      "Email, hosting, storage, sign-in, analytics and security vendors, to the extent enabled and needed for the service.",
      "Professional advisers, auditors, insurers and regulators where necessary and lawful.",
      "Law enforcement, courts or authorities where required by law or necessary to prevent serious fraud or protect safety.",
      "A successor in a merger or asset transfer, subject to confidentiality and legal safeguards.",
    ],
    afterBullets: ["Quickfiss does not sell personal data as a standalone product."],
  },
  {
    title: "International processing",
    paras: [
      "Some hosting, email or other service providers may process information outside Nigeria. Where personal data is transferred outside Nigeria we assess the transfer and apply the safeguards required by Nigerian data-protection law. Details of material processors can be requested from our privacy contact.",
    ],
  },
  {
    title: "Cookies and notifications",
    paras: [
      "We use essential cookies or similar technologies to keep you signed in, protect accounts, remember preferences and support booking. Where we use non-essential analytics or advertising technologies we will provide the choices and notices the law requires.",
      "We send service messages about registration, bookings, payments, cancellations, safety, support and disputes using the contact channels you provide. Marketing messages are optional and sent only where permitted; opting out of marketing does not stop essential booking, security or legal notices.",
    ],
  },
  {
    title: "Security and data breaches",
    paras: [
      "We use administrative, technical and organisational safeguards appropriate to the risks, such as access controls, staff permissions and secure transmission. No website can be guaranteed completely secure, so please protect your password and report suspected misuse promptly. If a personal-data breach occurs we will assess and respond as applicable notification and remediation obligations require.",
      "Identity documents, NIN-related materials, provider bank details and complaint evidence are accessible only to authorised personnel who need them. Quickfiss will never ask for your password, one-time code or card PIN by ordinary email or chat.",
    ],
  },
  {
    title: "How long we keep data",
    paras: [
      "We keep personal data only as long as reasonably necessary for the purpose it was collected, including bookings, provider status, complaints, payment reconciliation, legal and accounting duties and dispute resolution. When data is no longer needed we delete it, anonymise it or securely restrict access, subject to lawful retention obligations and the need to preserve evidence for ongoing claims.",
    ],
  },
  {
    title: "Your data-protection rights",
    paras: [
      `Subject to applicable law, you may have the right to be informed about processing, access your personal data, correct inaccurate data, request deletion, object to or restrict certain processing, receive a portable copy, withdraw consent, and complain to the Nigeria Data Protection Commission (NDPC). To exercise a right, email ${COMPANY.privacyEmail} with the subject "${COMPANY.privacySubject}". We may need to verify your identity, and will respond within the time the law requires. We may not be able to erase records we must keep by law or need for an existing claim, but we will explain any limitation.`,
    ],
  },
  {
    title: "Children",
    paras: [
      "Quickfiss is designed for adults. Provider applicants must be at least 18. If a booking involves a child's address or photo, a parent or lawful guardian should make the booking and limit the information shared. Contact us if you believe a child's data has been provided inappropriately.",
    ],
  },
  {
    title: "Third-party websites and services",
    paras: [
      "The website and app may link to third-party services, including a payment provider. We do not control their privacy practices, so please review their notices. A link does not mean Quickfiss endorses the service.",
    ],
  },
  {
    title: "Changes to this policy",
    paras: [
      "We may update this policy when services, technology or legal requirements change. We will post the current version and effective date, and give any additional notice required for material changes.",
    ],
  },
  {
    title: "Contact",
    paras: [
      `Privacy and data requests: ${COMPANY.privacyEmail}, subject "${COMPANY.privacySubject}". ${COMPANY.name}, ${COMPANY.address}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro="How Quickfiss collects, uses, shares and protects personal data in Nigeria."
      sections={sections}
    />
  );
}
