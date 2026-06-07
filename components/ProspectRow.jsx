import React, { useState } from "react";
import { Mail, ChevronDown, Copy, Check, RotateCw, MapPin, Building, Sparkles } from "lucide-react";
import Avatar from "./Avatar";
import ConfBadge from "./ConfBadge";
import Tag from "./Tag";
import Spinner from "./Spinner";

function SectionLabel({ children }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
      {children}
    </div>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-600">
      <span className="text-slate-400 shrink-0 mt-0.5">{icon}</span>
      <span className="font-semibold text-slate-500 mr-1">{label}:</span>
      <span className="text-slate-800">{children}</span>
    </div>
  );
}

export default function ProspectRow({ p, index }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("email");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = async (channel) => {
    setLoading(true);
    setMsg(null);
    try {
      const r = await fetch("/api/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect: p, channel }),
      });
      const d = await r.json();
      setMsg({ ...d, channel });
    } catch {
      setMsg({ error: "Generation failed. Try again." });
    }
    setLoading(false);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const msgText = msg?.channel === "email" ? `Subject: ${msg.subject}\n\n${msg.body}` : msg?.message || "";

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 anim-fade-up ${
        open ? "bg-slate-50/50 border-indigo-200 shadow-md" : "bg-white border-slate-200 shadow-sm"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* ── Row header ── */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-5 py-3.5 text-left hover:bg-slate-50/80 transition-colors cursor-pointer border-none bg-none"
      >
        <Avatar name={p.name} sizeClass="w-[38px] h-[38px] text-[14.5px]" idx={index} />

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-[14.5px] text-slate-900 font-sans">
              {p.name}
            </span>
          </div>
          <div className="text-slate-400 text-xs truncate">
            {p.title} &middot; {p.company}
          </div>
        </div>

        <span className="text-slate-400 text-xs flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {p.location}
        </span>

        <ConfBadge score={p.confidence} />

        <span className={`text-slate-300 transition-transform duration-200 ${open ? "rotate-180 text-indigo-600" : ""}`}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {/* ── Expanded panel ── */}
      {open && (
        <div className="border-t border-slate-200 p-6 pb-5 anim-expand-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT SIDE DETAILS */}
            <div className="flex flex-col gap-5">
              {/* Contact Details */}
              <section>
                <SectionLabel>Contact Details</SectionLabel>
                <div className="mt-2.5 flex flex-col gap-2">
                  <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Email">
                    <span className="font-mono text-indigo-600 text-[12.5px]">{p.email}</span>
                  </InfoRow>
                  <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} label="Location">
                    {p.location}
                  </InfoRow>
                  <InfoRow icon={<Building className="w-3.5 h-3.5" />} label="Company">
                    {p.company} &middot; {p.companySize}
                  </InfoRow>
                  {p.revenue && (
                    <InfoRow icon={<Sparkles className="w-3.5 h-3.5" />} label="Revenue">
                      {p.revenue}
                    </InfoRow>
                  )}
                </div>
              </section>

              {/* Personalization Hooks */}
              {p.hooks?.length > 0 && (
                <section>
                  <SectionLabel>✦ Personalization Hooks</SectionLabel>
                  <div className="mt-2.5 flex flex-col gap-2">
                    {p.hooks.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <span className="text-indigo-600 shrink-0 font-bold">&rarr;</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Pain Points & Tech Stack Tags */}
              <div className="flex flex-col gap-4">
                {p.painPoints?.length > 0 && (
                  <section>
                    <SectionLabel>Pain Points</SectionLabel>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.painPoints.map((pt, i) => (
                        <Tag key={i} variant="red">
                          {pt}
                        </Tag>
                      ))}
                    </div>
                  </section>
                )}
                {p.techStack?.length > 0 && (
                  <section>
                    <SectionLabel>Tech Stack</SectionLabel>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.techStack.map((t, i) => (
                        <Tag key={i} variant="blue">
                          {t}
                        </Tag>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            {/* RIGHT SIDE — AI Outreach Message */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <SectionLabel>AI Outreach Message</SectionLabel>
                <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                  {["email", "linkedin"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTab(t);
                        setMsg(null);
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 border-none cursor-pointer ${
                        tab === t
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "bg-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {t === "email" ? (
                        <>
                          <Mail className="w-3 h-3" /> Email
                        </>
                      ) : (
                        <>
                          LinkedIn
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate CTA Button */}
              {!msg && !loading && (
                <button
                  onClick={() => generate(tab)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-4 py-2.5 text-xs flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/10 transition-colors border-none cursor-pointer font-sans"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Write {tab === "email" ? "Email" : "LinkedIn message"} with AI
                </button>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center gap-2.5 py-2 text-slate-400 text-xs justify-center font-medium">
                  <Spinner /> Personalizing outreach for {p.name}...
                </div>
              )}

              {/* Output Content */}
              {msg && !msg.error && (
                <div className="flex flex-col gap-3 flex-1">
                  {msg.channel === "email" && (
                    <>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Subject Line
                        </div>
                        <div className="text-xs font-semibold text-slate-900 leading-normal">{msg.subject}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex-1">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Email Body
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                          {msg.body}
                        </p>
                      </div>
                    </>
                  )}
                  {msg.channel === "linkedin" && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex-1">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Connection Request &middot; {msg.message?.length || 0}/300 chars
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.message}
                      </p>
                    </div>
                  )}

                  {/* Actions (Copy / Retry) */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copy(msgText)}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        copied
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Message
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setMsg(null);
                        generate(tab);
                      }}
                      className="px-3 py-2 text-xs font-semibold text-slate-400 border border-slate-200 rounded-lg flex items-center gap-1.5 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer bg-slate-50"
                    >
                      <RotateCw className="w-3.5 h-3.5" /> Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Error Handling */}
              {msg?.error && (
                <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg p-2.5 leading-normal">
                  {msg.error}
                </p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
