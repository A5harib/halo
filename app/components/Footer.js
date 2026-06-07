import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "#050814",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 24px 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "2px solid #34d399",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(52,211,153,0.1)",
                }}
              >
                <Zap size={14} color="#34d399" />
              </div>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 20,
                  letterSpacing: "0.05em",
                  color: "#f0f4ff",
                }}
              >
                ProspectHalo
              </span>
            </div>
            <p style={{ color: "#8892b0", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Find the right prospects and start real conversations. From one sentence.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ color: "#f0f4ff", fontSize: 13, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Product
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["How it works", "Pricing"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{ color: "#8892b0", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.color = "#34d399")}
                  onMouseLeave={(e) => (e.target.style.color = "#8892b0")}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: "#f0f4ff", fontSize: 13, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Company
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Contact", "Blog"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{ color: "#8892b0", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.color = "#34d399")}
                  onMouseLeave={(e) => (e.target.style.color = "#8892b0")}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: "#f0f4ff", fontSize: 13, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Legal
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Privacy Policy", "Terms of Service", "Refund Policy"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{ color: "#8892b0", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.target.style.color = "#34d399")}
                  onMouseLeave={(e) => (e.target.style.color = "#8892b0")}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" style={{ marginBottom: 24 }} />

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p style={{ color: "#4a5568", fontSize: 12, lineHeight: 1.7, maxWidth: 600 }}>
            ProspectHalo is not affiliated with, endorsed by, or sponsored by LinkedIn, Microsoft, or Google.
            LinkedIn is a trademark of LinkedIn Corporation. You connect your own accounts and are responsible
            for following each platform&apos;s terms and applicable laws, including GDPR and CAN-SPAM.
          </p>
          <p style={{ color: "#4a5568", fontSize: 13 }}>
            © 2026 ProspectHalo. Built with ❤️ by Umer Arif
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
