"use client";

import { useState } from "react";
import Link from "next/link";
import { Location, Call, Sms, Clock, TickCircle, MessageQuestion } from "iconsax-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setSent(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-primary-light selection:text-primary">
      <LandingNavbar />

      <main>
        {/* Header */}
        <section className="bg-gradient-to-b from-primary-light/40 via-white to-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Contact & Support
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                How Can We Help You?
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                Whether you have questions about booking an artisan, need corporate assistance, or need help with a payment dispute, we are available 24/7.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Details & Form */}
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              {/* Left Column: Direct channels */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-border/80 bg-zinc-50/70 p-8 sm:p-10">
                  <h2 className="text-xl font-bold text-foreground">Direct Contact Channels</h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Reach our customer advocacy team through any of the following channels:
                  </p>

                  <div className="mt-8 flex flex-col gap-6 text-sm">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <Location size={22} color="#3d5afe" variant="Bold" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Headquarters</p>
                        <p className="mt-0.5 text-xs text-muted">14 Adeola Odeku Street, Victoria Island, Lagos, Nigeria</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <Call size={22} color="#3d5afe" variant="Bold" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Phone & WhatsApp</p>
                        <p className="mt-0.5 text-xs text-muted">+234 1 800 QUICK (784-253)</p>
                        <p className="text-[11px] text-zinc-500">Toll-free across all Nigerian networks</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <Sms size={22} color="#3d5afe" variant="Bold" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Customer Email</p>
                        <p className="mt-0.5 text-xs text-muted">support@quickfiss.com</p>
                        <p className="text-[11px] text-zinc-500">Average response time: 15 minutes</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <Clock size={22} color="#3d5afe" variant="Bold" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Operational Hours</p>
                        <p className="mt-0.5 text-xs text-muted">Monday &ndash; Sunday: 24 Hours Active</p>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Callout */}
                  <div className="mt-10 rounded-2xl border border-primary/20 bg-primary-light/40 p-5">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <MessageQuestion size={18} color="#3d5afe" variant="Bold" />
                      <span>Have a quick question?</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-600">
                      Check our frequently asked questions on escrow protection, vetting, and refunds.
                    </p>
                    <Link
                      href="/#faq"
                      className="mt-3 inline-block text-xs font-bold text-primary hover:underline"
                    >
                      Browse FAQs &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-border/80 bg-white p-8 shadow-xl shadow-zinc-200/40 sm:p-10">
                  <h2 className="text-2xl font-bold text-foreground">Send Us a Message</h2>
                  <p className="mt-1 text-xs text-muted">Fill out the form below and we will get back to you right away.</p>

                  {sent ? (
                    <div className="mt-8 rounded-2xl bg-emerald-50 p-8 text-center text-emerald-800">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <TickCircle size={32} color="#059669" variant="Bold" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold">Message Sent Successfully!</h3>
                      <p className="mt-2 text-xs leading-relaxed text-emerald-700">
                        Thank you for reaching out. A Quickfiss support representative has received your ticket and will contact you via email shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-semibold text-foreground">Full Name</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Babatunde Alabi"
                            className="mt-1.5 w-full rounded-xl border border-border px-4 py-3.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-foreground">Email Address</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="babatunde@example.com"
                            className="mt-1.5 w-full rounded-xl border border-border px-4 py-3.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground">Inquiry Topic</label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                        >
                          <option value="General Support">General Support</option>
                          <option value="Artisan Registration">Artisan Verification & Registration</option>
                          <option value="Escrow & Payment Support">Escrow & Payment Question</option>
                          <option value="Job Dispute">Job Dispute / Quality Issue</option>
                          <option value="Corporate Partnership">Corporate Partnership</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground">Your Message</label>
                        <textarea
                          rows={5}
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Describe how we can help you in detail..."
                          className="mt-1.5 w-full rounded-xl border border-border px-4 py-3.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <button
                        type="submit"
                        className="mt-3 rounded-btn bg-primary py-4 text-sm font-bold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.98]"
                      >
                        Send Message
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
