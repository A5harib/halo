import React from "react";

export default function ConfBadge({ score }) {
  const cfg = score >= 90
    ? { colorClass: "bg-emerald-50 border-emerald-200 text-emerald-600", label: "High" }
    : score >= 75
    ? { colorClass: "bg-amber-50 border-amber-200 text-amber-600", label: "Good" }
    : { colorClass: "bg-red-50 border-red-200 text-red-600", label: "Low" };

  return (
    <span className={`border rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide whitespace-nowrap ${cfg.colorClass}`}>
      {score}% {cfg.label}
    </span>
  );
}
