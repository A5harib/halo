import React from "react";

const AVATAR_CLASSES = [
  "bg-indigo-100 text-indigo-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-pink-100 text-pink-700",
  "bg-sky-100 text-sky-700",
  "bg-purple-100 text-purple-600",
];

export default function Avatar({ name, sizeClass = "w-[38px] h-[38px] text-[14.5px]", idx = 0 }) {
  const colorClass = AVATAR_CLASSES[idx % AVATAR_CLASSES.length];
  const initial = (name || "?")[0].toUpperCase();

  return (
    <div className={`rounded-full flex items-center justify-center font-semibold font-sans shrink-0 ${sizeClass} ${colorClass}`}>
      {initial}
    </div>
  );
}
