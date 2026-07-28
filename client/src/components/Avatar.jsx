"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth";

export function Avatar({ size = "md", className = "" }) {
  const auth = useAuth() || {};
  const displayName = auth.displayName || "User";
  const avatarUrl = auth.avatarUrl;

  const [imageError, setImageError] = useState(false);

  // Pixel dimensions corresponding to Tailwind sizing for Next.js Image
  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 80,
    xl: 96,
  };

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-20 w-20 text-2xl",
    xl: "h-24 w-24 text-3xl",
  };

  // Generate up to 2 uppercase initials safely
  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Render Next.js Image if avatarUrl exists and hasn't errored
  if (avatarUrl && !imageError) {
    const dimension = pixelSizes[size] || 40;

    return (
      <Image
        src={avatarUrl}
        alt={displayName || "Profile"}
        width={dimension}
        height={dimension}
        onError={() => setImageError(true)}
        className={`rounded-full object-cover ${sizes[size] || sizes.md} ${className}`}
        unoptimized={avatarUrl.startsWith("http")} // Prevents issues with external dynamic avatar URLs
      />
    );
  }

  // Fallback to initials avatar
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-[#004ac6] font-semibold text-white select-none ${
        sizes[size] || sizes.md
      } ${className}`}
    >
      {initials || "U"}
    </span>
  );
}

export default Avatar;