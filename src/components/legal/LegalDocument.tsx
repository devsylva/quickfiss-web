import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { COMPANY } from "@/lib/company";

export type LegalSection = {
  title: string;
  paras?: string[];
  bullets?: string[];
  afterBullets?: string[];
};

const DOCS = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Cancellation & Refund Policy" },
];

export function LegalDocument({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-primary-light selection:text-primary">
      <LandingNavbar />
      <main className="py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          <div className="border-b border-border/80 pb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h1>
            <p className="mt-2 text-xs text-muted">Effective: {COMPANY.effectiveDate}</p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">{intro}</p>
          </div>

          <div className="mt-10 text-sm leading-relaxed text-zinc-600">
            {sections.map((s, i) => (
              <section key={s.title} className="mb-8">
                <h2 className="text-lg font-bold text-foreground">
                  {i + 1}. {s.title}
                </h2>
                {s.paras?.map((p) => (
                  <p key={p} className="mt-2">
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {s.afterBullets?.map((p) => (
                  <p key={p} className="mt-2">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-xs text-muted">
            {DOCS.map((d) => (
              <Link key={d.href} href={d.href} className="transition-colors hover:text-primary">
                {d.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
