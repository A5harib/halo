import React from "react";

export default function SkeletonRow({ delay = 0 }) {
  return (
    <div 
      className="h-[68px] rounded-none border-2 border-[#1a1a1a] bg-[#f4efe6] shadow-[2px_2px_0px_#1a1a1a] overflow-hidden anim-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-full anim-shimmer" />
    </div>
  );
}
