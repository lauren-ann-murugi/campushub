"use client";

import { useCallback, useState } from "react";

/** Shared building blocks for the admin, teacher and student portal sections. */

export function SectionHeader({ title, description, children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-[#6b7280]">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

export function Card({ title, description, action, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs ${className}`}
    >
      {title ? (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
            {description ? (
              <p className="mt-1 text-xs text-[#6b7280]">{description}</p>
            ) : null}
          </div>
          {action}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-xs">
      <p className="text-xs font-medium text-[#6b7280]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#111827]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[#6b7280]">{hint}</p> : null}
    </div>
  );
}

export function Banner({ status }) {
  if (!status?.message) return null;
  const tone =
    status.type === "error"
      ? "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
      : "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]";
  return (
    <div
      role="status"
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${tone}`}
    >
      {status.message}
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-[#374151]">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-[#6b7280]">{hint}</span> : null}
    </label>
  );
}

const CONTROL =
  "w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] disabled:bg-[#f9fafb]";

export function Input(props) {
  return <input {...props} className={`${CONTROL} ${props.className || ""}`} />;
}

export function Textarea(props) {
  return <textarea {...props} className={`${CONTROL} ${props.className || ""}`} />;
}

export function Select({ options = [], placeholder, ...props }) {
  return (
    <select {...props} className={`${CONTROL} ${props.className || ""}`}>
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => {
        const value = typeof option === "string" ? option : option.value;
        const label = typeof option === "string" ? option : option.label;
        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

export function Button({ variant = "primary", className = "", ...props }) {
  const styles = {
    primary:
      "bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:bg-[#93c5fd] disabled:cursor-not-allowed",
    secondary:
      "border border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60",
    danger:
      "border border-[#fecaca] bg-white text-[#b91c1c] hover:bg-[#fef2f2] disabled:opacity-60",
  };
  return (
    <button
      {...props}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${styles[variant]} ${className}`}
    />
  );
}

export function Table({ columns, rows, empty = "Nothing here yet.", renderRow }) {
  if (!rows.length) {
    return (
      <p className="rounded-xl border border-dashed border-[#e5e7eb] px-4 py-8 text-center text-sm text-[#6b7280]">
        {empty}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#e5e7eb] text-xs uppercase tracking-wide text-[#6b7280]">
            {columns.map((column) => (
              <th key={column} className="px-3 py-2 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f3f4f6]">{rows.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

export function Cell({ children, className = "" }) {
  return <td className={`px-3 py-2.5 text-[#374151] ${className}`}>{children}</td>;
}

const BADGE_TONES = {
  present: "bg-[#dcfce7] text-[#166534]",
  paid: "bg-[#dcfce7] text-[#166534]",
  late: "bg-[#fef9c3] text-[#854d0e]",
  partial: "bg-[#fef9c3] text-[#854d0e]",
  pending: "bg-[#fef9c3] text-[#854d0e]",
  excused: "bg-[#e0e7ff] text-[#3730a3]",
  absent: "bg-[#fee2e2] text-[#991b1b]",
  default: "bg-[#f3f4f6] text-[#374151]",
};

export function Badge({ value }) {
  const tone = BADGE_TONES[String(value).toLowerCase()] || BADGE_TONES.default;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>
      {value}
    </span>
  );
}

export function Loading({ label = "Loading…" }) {
  return (
    <p className="rounded-xl border border-dashed border-[#e5e7eb] px-4 py-8 text-center text-sm text-[#6b7280]">
      {label}
    </p>
  );
}

/** Status banner state shared by every section, with auto-clearing messages. */
export function useStatus() {
  const [status, setStatus] = useState(null);

  const announce = useCallback((type, message) => {
    setStatus({ type, message });
    if (type === "success") {
      setTimeout(() => setStatus(null), 4000);
    }
  }, []);

  const clear = useCallback(() => setStatus(null), []);

  return { status, announce, clear };
}

export function errorMessage(err) {
  if (err?.status === 401) return "Your session expired. Sign in again.";
  return err?.message || "Something went wrong. Please try again.";
}

export function formatMoney(value) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(value) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
