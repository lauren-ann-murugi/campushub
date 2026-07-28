"use client";

import React from "react";

export default function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#191c1e]">{title}</h2>
        {subtitle && <p className="text-xs text-[#434655] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}