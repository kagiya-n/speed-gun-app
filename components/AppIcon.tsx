import React from "react";

// This SVG serves as the source for the PNG icons referenced in manifest.json.
// You would use an online converter or a command-line tool to generate
// icon-192x192.png and icon-512x512.png from this source file.
export const AppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
  >
    {/* Background Circle */}
    <circle
      cx="50"
      cy="50"
      r="48"
      fill="#0f172a"
      stroke="#1e293b"
      strokeWidth="4"
    />

    {/* Speedometer Arc */}
    <path
      d="M20 70 A 35 35 0 1 1 80 70"
      stroke="#38bdf8"
      strokeWidth="8"
      strokeLinecap="round"
    />

    {/* Needle */}
    <line
      x1="50"
      y1="50"
      x2="75"
      y2="35"
      stroke="#f1f5f9"
      strokeWidth="5"
      strokeLinecap="round"
    />

    {/* Play Icon in the middle */}
    <polygon points="45,40 65,50 45,60" fill="#06b6d4" />
  </svg>
);
