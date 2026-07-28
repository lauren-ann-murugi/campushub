"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../lib/auth";
import { DashboardHeader, PanelCard, Badge } from "../DashboardLayout";
import {
  HelpCircleIcon,
  SendIcon,
  CheckIcon,
  AlertCircleIcon,
} from "../../../components/icons";

const CATEGORIES = [
  { value: "academic", label: "Academic" },
  { value: "fees", label: "Fees & Payments" },
  { value: "technical", label: "Technical Issue" },
  { value: "other", label: "Other" },
];

export function SupportSection() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("academic");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch support tickets from your Python API
  const loadTickets = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch("/api/support/tickets");
      if (!res.ok) {
        throw new Error("Failed to load support tickets.");
      }
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      // Fallback empty list on connection error
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  // Submit ticket to Python API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit ticket.");
      }

      setSuccess("Your ticket has been submitted. We'll get back to you soon.");
      setSubject("");
      setMessage("");
      setCategory("academic");
      
      // Reload tickets to update list
      loadTickets();
      
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || "An error occurred while submitting your ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    if (status === "resolved") return <Badge variant="green">Resolved</Badge>;
    if (status === "in_progress") return <Badge variant="amber">In Progress</Badge>;
    return <Badge variant="blue">Open</Badge>;
  };

  return (
    <>
      <DashboardHeader
        title="Support"
        subtitle="Submit a support ticket or view your existing requests."
      />

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckIcon className="h-4 w-4 shrink-0" /> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircleIcon className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Ticket Creation Form */}
        <div>
          <PanelCard title="New Support Ticket">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="sup-cat" className="text-sm font-medium text-[#191c1e]">
                  Category
                </label>
                <select
                  id="sup-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-base text-[#191c1e] transition-colors focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="sup-sub" className="text-sm font-medium text-[#191c1e]">
                  Subject
                </label>
                <input
                  id="sup-sub"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of the issue"
                  className="w-full rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-base text-[#191c1e] placeholder:text-[#434655]/50 transition-colors focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="sup-msg" className="text-sm font-medium text-[#191c1e]">
                  Message
                </label>
                <textarea
                  id="sup-msg"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="w-full resize-none rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-base text-[#191c1e] placeholder:text-[#434655]/50 transition-colors focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#004ac6] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#003ba6] disabled:opacity-60"
              >
                <SendIcon className="h-4 w-4" />{" "}
                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          </PanelCard>
        </div>

        {/* Existing Tickets List */}
        <div className="lg:col-span-2">
          <PanelCard title="Your Tickets">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-[#434655]">
                Loading...
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f9fb]">
                  <HelpCircleIcon className="h-6 w-6 text-[#434655]" />
                </span>
                <p className="text-sm text-[#434655]">
                  You haven't submitted any tickets yet.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {tickets.map((t) => (
                  <li key={t.id} className="rounded-xl border border-[#e6e8ea] p-4 transition-colors hover:border-[#c3c6d7]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#191c1e]">{t.subject}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-[#434655]">{t.message}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <Badge variant="gray">
                            {CATEGORIES.find((c) => c.value === t.category)?.label ?? t.category}
                          </Badge>
                          <span className="text-xs text-[#434655]">
                            {new Date(t.created_at || t.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      {statusBadge(t.status)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </PanelCard>
        </div>
      </div>
    </>
  );
}