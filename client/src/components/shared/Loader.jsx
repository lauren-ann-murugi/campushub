"use client";

import React from "react";

export default function Loader({ label = "Loading data..." }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#e6e8ea] border-t-[#004ac6]" />
      <p className="text-xs font-medium text-[#434655]">{label}</p>
    </div>
  );
}