"use client";
import { useState } from "react";
import { Mail,  Building2, MapPin, Phone, ExternalLink, Plus, Download } from "lucide-react";

export default function ProspectCard({ prospect, onAddCampaign }) {
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(null);
  const [showMsg, setShowMsg] = useState(false);

  const handleGenerateMessage = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect, channel: "email" }),
      });
      const data = await res.json();
      setMessage(data.message);
      setShowMsg(true);
    } catch {
      setMessage("Failed to generate message. Please try again.");
      setShowMsg(true);
    }
    setGenerating(false);
  };

  const confidenceColor =
    prospect.confidence >= 90
      ? "#34d399"
      : prospect.confidence >= 75
      ? "#fbbf24"
      : "#f87171";

  return (
    <div
      className="card"
      style={{
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {/* Avatar */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: `linear-gradient(135deg, #34d399, #60a5fa)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
              color: "#050814",
              flexShrink: 0,
            }}
          >
            {prospect.name?.[0] || "?"}
          </div>
          <div>
            <div style={{ color: "#f0f4ff", fontWeight: 600, fontSize: 15 }}>
              {prospect.name}
            </div>
            <div style={{ color: "#8892b0", fontSize: 13 }}>
              {prospect.title}
            </div>
          </div>
        </div>
        {/* Confidence */}
        <div
          style={{
            background: `${confidenceColor}18`,
            border: `1px solid ${confidenceColor}40`,
            color: confidenceColor,
            borderRadius: 100,
            padding: "3px 10px",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {prospect.confidence}% match
        </div>
      </div>

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Detail icon={<Building2 size={13} />} text={prospect.company} />
        <Detail icon={<MapPin size={13} />} text={prospect.location} />
        <Detail icon={<Mail size={13} />} text={prospect.email} mono />
        {prospect.phone && <Detail icon={<Phone size={13} />} text={prospect.phone} mono />}
      </div>

      {/* Tags */}
      {prospect.hooks && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {prospect.hooks.slice(0, 3).map((h, i) => (
            <span
              key={i}
              style={{
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.15)",
                color: "#34d399",
                borderRadius: 6,
                padding: "2px 8px",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {h}
            </span>
          ))}
        </div>
      )}

      {/* Generated message */}
      {showMsg && message && (
        <div
          style={{
            background: "rgba(52,211,153,0.05)",
            border: "1px solid rgba(52,211,153,0.2)",
            borderRadius: 8,
            padding: "12px 14px",
          }}
        >
          <div style={{ color: "#34d399", fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            AI-Generated Message
          </div>
          <p style={{ color: "#c0c8d8", fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
            {message}
          </p>
          <button
            onClick={() => setShowMsg(false)}
            style={{ marginTop: 8, background: "none", border: "none", color: "#8892b0", fontSize: 12, cursor: "pointer" }}
          >
            Hide
          </button>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={handleGenerateMessage}
          disabled={generating}
          style={{
            background: generating ? "rgba(52,211,153,0.1)" : "rgba(52,211,153,0.12)",
            border: "1px solid rgba(52,211,153,0.25)",
            color: "#34d399",
            borderRadius: 7,
            padding: "7px 14px",
            fontSize: 13,
            fontWeight: 500,
            cursor: generating ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {generating ? (
            <>
              <span style={{ animation: "spin-slow 1s linear infinite", display: "inline-block" }}>⟳</span>
              Writing…
            </>
          ) : (
            <>✦ AI Message</>
          )}
        </button>
        <button
          onClick={() => onAddCampaign && onAddCampaign(prospect)}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            color: "#8892b0",
            borderRadius: 7,
            padding: "7px 14px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
        >
          <Plus size={13} /> Add to Campaign
        </button>
        {prospect.linkedin && (
          <a
            href={prospect.linkedin}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "#8892b0",
              borderRadius: 7,
              padding: "7px 10px",
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            
          </a>
        )}
      </div>
    </div>
  );
}

function Detail({ icon, text, mono }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#8892b0", fontSize: 13 }}>
      <span style={{ color: "#4a5568", flexShrink: 0 }}>{icon}</span>
      <span style={mono ? { fontFamily: "'JetBrains Mono', monospace", fontSize: 12 } : {}}>
        {text}
      </span>
    </div>
  );
}
