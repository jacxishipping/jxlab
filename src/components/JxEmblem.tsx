import React from "react";

interface JxEmblemProps {
  className?: string;
}

export function JxEmblem({ className = "h-8 w-8" }: JxEmblemProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="10"
        fill="#1E1712"
        stroke="#E88B2E"
        strokeWidth="2"
      />
      {/* Geometric J + X circuit monogram */}
      <path
        d="M15 11V23.5C15 26 13.4 27.5 11.2 27.5C10.1 27.5 9.2 27.1 8.5 26.5"
        stroke="#FBF5E8"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12L30.5 27.5M30.5 12L21 27.5"
        stroke="#E88B2E"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="15" cy="11" r="2" fill="#F6B96D" />
    </svg>
  );
}
