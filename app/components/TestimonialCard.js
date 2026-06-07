"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        border: hovered ? "1px solid rgba(52,211,153,0.25)" : "1px solid var(--border-subtle)",
        borderRadius: 14,
        padding: "28px 28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.3)" : "none",
      }}
    >
      {/* Stars */}
      <div style={{ display: "flex", gap: 3 }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="#34d399" color="#34d399" />
        ))}
      </div>

      {/* Quote */}
      <blockquote
        style={{
          color: "#c0c8d8",
          fontSize: 15,
          lineHeight: 1.75,
          fontStyle: "italic",
          flex: 1,
          margin: 0,
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${testimonial.color1}, ${testimonial.color2})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 16,
            color: "#050814",
            flexShrink: 0,
          }}
        >
          {testimonial.name[0]}
        </div>
        <div>
          <div style={{ color: "#f0f4ff", fontSize: 14, fontWeight: 600 }}>
            {testimonial.name}
          </div>
          <div style={{ color: "#8892b0", fontSize: 13 }}>
            {testimonial.role}
          </div>
        </div>
      </div>
    </div>
  );
}
