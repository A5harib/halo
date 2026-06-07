import React from "react";

const AVATAR_COLORS = [
  "bg-[#f9eae6] text-[#c2593f]",
  "bg-[#e0f2e9] text-[#2e5a44]",
  "bg-[#fef3d6] text-[#855b09]",
  "bg-[#fce8e6] text-[#942e29]",
  "bg-[#e8eff9] text-[#1b3e70]",
  "bg-[#f4efe6] text-[#1a1a1a]",
];

export default function Avatar({ name, sizeClass = "w-[36px] h-[36px] text-xs", idx = 0 }) {
  const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const initial = (name || "?")[0].toUpperCase();

  return (
    <div className={`rounded-none border-2 border-[#1a1a1a] font-mono font-bold tracking-wider shrink-0 flex items-center justify-center shadow-[2px_2px_0px_#1a1a1a] select-none ${sizeClass} ${colorClass}`}>
      {initial}
    </div>
  );
}
