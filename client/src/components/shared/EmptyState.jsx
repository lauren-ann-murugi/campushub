"use client";

import React from "react";
import { FolderIcon } from "../icons";

export default function EmptyState({
  title = "No information found",
  description = "There are no entries to show at this moment.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#c3c6d7] bg-[#f7f9fb] p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#e6e8ea]">
        <FolderIcon className="h-6 w-6 text-[#434655]" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-[#191c1e]">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-[#434655]">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-xl bg-[#004ac6] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#003ba6]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}