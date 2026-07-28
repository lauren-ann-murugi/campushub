"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Loader2,
  Sparkles 
} from "lucide-react";

//import { supabase } from "@/lib/supabase"; // Adjust path to match your project setup
import { PrimaryNavigationSection } from "./sections/PrimaryNavigationSection/PrimaryNavigationSection";
import { SiteFooterSection } from "./sections/SiteFooterSection/SiteFooterSection";

const CONTACT_INFO = [
  { 
    icon: Mail, 
    label: "Email Us", 
    value: "support@campushub.edu", 
    href: "mailto:support@campushub.edu",
    subtext: "We aim to reply within 24 hours"
  },
  { 
    icon: Phone, 
    label: "Call Us", 
    value: "+234 800 123 4567", 
    href: "tel:+2348001234567",
    subtext: "Mon-Fri from 8am to 5pm"
  },
  { 
    icon: MapPin, 
    label: "Visit Our Office", 
    value: "14 Education Drive, Lagos, Nigeria", 
    href: null,
    subtext: "Headquarters & Support Center"
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Store contact messages as support tickets with category "contact"
      const { error: insertErr } = await supabase.from("support_tickets").insert({
        subject: formData.subject || "Contact form submission",
        message: `From: ${formData.name} <${formData.email}>\n\n${formData.message}`,
        category: "contact",
        status: "open",
      });

      if (insertErr) {
        throw new Error(insertErr.message);
      }

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Could not submit your message. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900">
      <PrimaryNavigationSection />

      {/* Hero Header */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span>We're Here to Help</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>

          <p className="mt-4 text-base text-blue-100/90 sm:text-lg max-w-xl mx-auto leading-relaxed">
            Have questions, feedback, or need administrative assistance? Send us a message and our support team will respond promptly.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="mx-auto max-w-6xl px-4 -mt-8 relative z-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {CONTACT_INFO.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-center text-base font-semibold text-slate-900">
                  {item.label}
                </h3>

                <div className="mt-2 text-center">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-slate-700">{item.value}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">{item.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Contact Form */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-10">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Send Us a Message
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Fill out the form below and we'll create a ticket directly with our support team.
            </p>
          </div>

          {/* Alert Notifications */}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-800">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Message delivered successfully!</p>
                <p className="mt-0.5 text-emerald-700">Thank you for contacting CampusHub. Our team will get back to you within 24 hours.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-rose-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Submission failed</p>
                <p className="mt-0.5 text-rose-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              
              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-800">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
              </div>

            </div>

            {/* Subject Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-sm font-semibold text-slate-800">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help your institution?"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all"
              />
            </div>

            {/* Message Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-semibold text-slate-800">
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Provide as much detail as possible..."
                className="resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </section>

      <SiteFooterSection />
    </main>
  );
}