import React from "react";

const TAG_CLASSES = {
  green: "bg-[#e0f2e9] text-[#2e5a44]",
  red: "bg-[#fce8e6] text-[#942e29]",
  blue: "bg-[#e8eff9] text-[#1b3e70]",
  neutral: "bg-[#f4efe6] text-[#1a1a1a]",
  indigo: "bg-[#f9eae6] text-[#c2593f]",
};

export default function Tag({ children, variant = "neutral" }) {
  const colorClass = TAG_CLASSES[variant] || TAG_CLASSES.neutral;
  return (
    <span className={`inline-block border-2 border-[#1a1a1a] rounded-none font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 whitespace-normal break-words max-w-full shadow-[1.5px_1.5px_0px_#1a1a1a] select-none ${colorClass}`}>
      {children}
    </span>
  );
}
