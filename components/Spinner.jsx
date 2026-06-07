import React from "react";

export default function Spinner({ className = "w-4 h-4 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin shrink-0 inline-block" }) {
  return <span className={className} />;
}
