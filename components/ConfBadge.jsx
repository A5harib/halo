import React from "react";

export default function ConfBadge({ score }) {
  const isHigh = score >= 90;
  const isGood = score >= 75;

  const cfg = isHigh
    ? { colorClass: "bg-[#e0f2e9] text-[#2e5a44]", label: "HIGH", ticks: "▰▰▰▰" }
    : isGood
    ? { colorClass: "bg-[#fef3d6] text-[#855b09]", label: "MID", ticks: "▰▰▰▱" }
    : { colorClass: "bg-[#fce8e6] text-[#942e29]", label: "LOW", ticks: "▰▱▱▱" };

  return (
    <span className={`border-2 border-[#1a1a1a] rounded-none font-mono text-[9.5px] px-2.5 py-1 flex items-center gap-2 tracking-wider whitespace-nowrap uppercase shadow-[2px_2px_0px_#1a1a1a] select-none ${cfg.colorClass}`}>
      <span className="opacity-90 font-mono text-[9px]">{cfg.ticks}</span>
      <span className="font-extrabold">{cfg.label} &middot; {score}%</span>
    </span>
  );
}
