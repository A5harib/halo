import React from "react";

export default function SkeletonRow({ delay = 0 }) {
  return (
    <div 
      className="h-[68px] rounded-xl border border-slate-200 overflow-hidden anim-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-full anim-shimmer" />
    </div>
  );
}
