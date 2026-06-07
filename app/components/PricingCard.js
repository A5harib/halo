"use client";
import { useState } from "react";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

export default function PricingCard({ plan }) {
  const [hovered, setHovered] = useState(false);

  const {
    name,
    price,
    period,
    tagline,
    description,
    features,
    cta,
    ctaHref,
    highlighted,
    badge,
  } = plan;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: highlighted ? "rgba(52,211,153,0.05)" : "var(--bg-card)",
        border: highlighted
          ? "1px solid rgba(52,211,153,0.4)"
          : hovered
          ? "1px solid rgba(52,211,153,0.2)"
          : "1px solid var(--border-subtle)",
        borderRadius: 16,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "all 0.25s ease",
        transform: highlighted ? "scale(1.02)" : hovered ? "scale(1.01)" : "scale(1)",
        boxShadow: highlighted
          ? "0 0 60px rgba(52,211,153,0.1), 0 20px 60px rgba(0,0,0,0.3)"
          : hovered
          ? "0 20px 60px rgba(0,0,0,0.3)"
          : "none",
      }}
    >
      {/* Badge */}
      {badge && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#34d399",
            color: "#050814",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 14px",
            borderRadius: 100,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: highlighted ? "#34d399" : "#8892b0", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
          {name}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 8 }}>
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: price === "Talk with us" ? 28 : 48,
              color: "#f0f4ff",
              lineHeight: 1,
            }}
          >
            {price === "Talk with us" ? price : `$${price}`}
          </span>
          {period && (
            <span style={{ color: "#8892b0", fontSize: 14, marginBottom: 6 }}>{period}</span>
          )}
        </div>
        <p style={{ color: "#8892b0", fontSize: 14, lineHeight: 1.5 }}>{tagline}</p>
      </div>

      {/* Divider */}
      <div className="divider" style={{ marginBottom: 24 }} />

      {/* Features */}
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, flex: 1 }}>
        {features.map((f, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#c0c8d8" }}>
            <Check size={15} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={ctaHref || "/dashboard"}
        className={highlighted ? "btn-primary" : "btn-secondary"}
        style={{ justifyContent: "center", textAlign: "center" }}
      >
        {cta}
      </Link>
    </div>
  );
}
