"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is ProspectHalo?",
    a: "ProspectHalo is an AI sales-engagement platform. Describe your ideal customer in plain English to find the right prospects with verified contact details, then run one multichannel sequence across your own LinkedIn and email accounts, with AI personalizing every message, and manage every reply in one unified inbox.",
  },
  {
    q: "Does it send the messages for me?",
    a: "Yes. Once you connect your LinkedIn and/or email account, ProspectHalo's AI writes and sends personalized messages on your behalf, following the sequence you set up. You review and can edit any message before it goes out.",
  },
  {
    q: "Is my account safe when sending messages?",
    a: "We take safety seriously. ProspectHalo enforces daily sending limits aligned with platform guidelines, uses auto-warmup to build sending reputation gradually, and rotates sending across multiple connected accounts if you have them. Your accounts stay safe.",
  },
  {
    q: "Is this data accurate and up to date?",
    a: "Our prospect database is updated continuously. Every contact is verified with email validation before being surfaced to you. We also show a confidence score on each contact so you know exactly how reliable the data is.",
  },
  {
    q: "How is this different from Apollo, ZoomInfo, or a separate sales tool?",
    a: "Apollo and ZoomInfo are data tools — they find contacts but you still need a separate tool to send outreach. ProspectHalo does both in one place: find prospects, write personalized messages, send them from your own accounts, and manage all replies in one inbox. No stitching five tools together.",
  },
  {
    q: "What happens when I hit my monthly limit?",
    a: "You'll get a notification as you approach your limit. You can upgrade to a higher plan at any time, or wait for your monthly reset. Existing campaigns continue running; only new prospect discovery is paused.",
  },
  {
    q: "Is this GDPR compliant?",
    a: "We process data in accordance with GDPR. You are responsible for ensuring your outreach complies with applicable laws including GDPR and CAN-SPAM. We provide tools to honor opt-outs and manage consent, but legal compliance for your campaigns is your responsibility.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account settings at any time with one click. No cancellation fees, no lock-in contracts. Your data remains accessible for 30 days after cancellation.",
  },
  {
    q: "What counts as one contact?",
    a: "One contact is one unique person in your prospect list — identified by a unique email or LinkedIn profile. If you search for the same person twice, they only count once toward your monthly limit.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {faqs.map((item, i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-card)",
            border: open === i ? "1px solid rgba(52,211,153,0.3)" : "1px solid var(--border-subtle)",
            borderRadius: 10,
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 24px",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              gap: 16,
            }}
          >
            <span style={{ color: "#f0f4ff", fontSize: 15, fontWeight: 500 }}>
              {item.q}
            </span>
            <ChevronDown
              size={18}
              color="#8892b0"
              style={{
                flexShrink: 0,
                transition: "transform 0.25s ease",
                transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
          <div
            style={{
              maxHeight: open === i ? 300 : 0,
              overflow: "hidden",
              transition: "max-height 0.3s ease",
            }}
          >
            <p
              style={{
                color: "#8892b0",
                fontSize: 14,
                lineHeight: 1.7,
                padding: "0 24px 20px",
              }}
            >
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
