import React from "react";

const TAG_CLASSES = {
  green: "bg-emerald-50 border-emerald-200 text-emerald-700",
  red: "bg-red-50 border-red-200 text-red-600",
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  neutral: "bg-slate-50 border-slate-200 text-slate-600",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-600",
};

export default function Tag({ children, variant = "neutral" }) {
  const colorClass = TAG_CLASSES[variant] || TAG_CLASSES.neutral;
  return (
    <span className={`border rounded-md px-2 py-0.5 text-[11.5px] font-medium whitespace-nowrap ${colorClass}`}>
      {children}
    </span>
  );
}
