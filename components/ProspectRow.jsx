import React, { useState } from "react";
import { Mail, ChevronDown, Copy, Check, RotateCw, MapPin, Building, Sparkles } from "lucide-react";
import Avatar from "./Avatar";
import ConfBadge from "./ConfBadge";
import Tag from "./Tag";
import Spinner from "./Spinner";

function SectionLabel({ children }) {
  return (
    <div className="text-[10px] font-mono font-black uppercase tracking-widest text-[#c2593f] flex items-center gap-1.5 mb-3 select-none">
      <span className="w-2 h-2 bg-[#c2593f] inline-block border border-[#1a1a1a]" />
      {children}
    </div>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5 text-xs text-[#1a1a1a] py-1">
      <span className="text-slate-600 shrink-0 mt-0.5">{icon}</span>
      <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-500 w-16 shrink-0 mt-0.5">{label}:</span>
      <span className="text-[#1a1a1a] font-sans font-bold leading-normal">{children}</span>
    </div>
  );
}

// Helper to generate simulated line numbers for editor layout
function EditorLayout({ title, content, type = "markdown" }) {
  const lines = content ? content.split("\n") : [];
  // Ensure at least 4 lines for visual structure
  const lineCount = Math.max(lines.length, 4);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => String(i + 1).padStart(2, "0"));

  return (
    <div className="bg-[#faf8f5] border-2 border-[#1a1a1a] overflow-hidden flex flex-col flex-1 shadow-[2px_2px_0px_#1a1a1a]">
      {/* Tab bar header */}
      <div className="bg-[#f4efe6] border-b-2 border-[#1a1a1a] px-3.5 py-2 flex items-center justify-between select-none">
        <span className="font-mono text-[10px] text-[#1a1a1a] font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
          <span className="w-2.5 h-2.5 bg-[#c2593f] border border-[#1a1a1a]" />
          {title}
        </span>
        <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">
          {type} &middot; utf-8
        </span>
      </div>
      
      {/* Editor body */}
      <div className="p-3.5 flex font-mono text-[11.5px] leading-relaxed overflow-x-auto code-scroll flex-1 min-h-[120px] bg-white">
        {/* Line numbers gutter */}
        <div className="select-none text-slate-400 border-r border-slate-300 pr-3 mr-3.5 text-right font-medium flex flex-col">
          {lineNumbers.map((num) => (
            <span key={num}>{num}</span>
          ))}
        </div>
        
        {/* Actual text body */}
        <div className="flex-1 whitespace-pre-wrap font-sans text-xs text-[#1a1a1a] font-medium leading-relaxed">
          {content || <span className="text-slate-400 italic">No message compiled. Run outreach generator.</span>}
        </div>
      </div>
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
      className={`border-2 border-[#1a1a1a] overflow-hidden transition-all duration-100 anim-fade-up ${
        open
          ? "bg-[#faf8f5] shadow-[4px_4px_0px_#1a1a1a] translate-x-[-1px] translate-y-[-1px]"
          : "bg-[#faf8f5] shadow-[4px_4px_0px_#1a1a1a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1a1a1a]"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* ── Row header ── */}
      <button
        id={`row-header-button-${index}`}
        onClick={() => setOpen(!open)}
        className="w-full grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-5 px-5 py-4 text-left hover:bg-[#f4efe6]/50 transition-colors cursor-pointer border-none bg-none outline-none"
      >
        <Avatar name={p.name} sizeClass="w-[36px] h-[36px] text-xs" idx={index} />

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-extrabold text-[15px] text-[#1a1a1a] tracking-wide font-sans">
              {p.name}
            </span>
          </div>
          <div className="text-slate-500 text-xs font-semibold truncate font-sans">
            {p.title} &middot; <span className="text-[#1a1a1a] font-bold">{p.company}</span>
          </div>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-[#1a1a1a] bg-[#f4efe6] border-2 border-[#1a1a1a] px-2.5 py-1 shadow-[1px_1px_0px_#1a1a1a]">
          <MapPin className="w-3.5 h-3.5 text-slate-500 stroke-[2.5px]" /> {p.location}
        </span>

        <ConfBadge score={p.confidence} />

        <span className={`text-[#1a1a1a] transition-transform duration-200 ${open ? "rotate-180 text-[#c2593f]" : ""}`}>
          <ChevronDown className="w-4 h-4 stroke-[2.5px]" />
        </span>
      </button>

      {/* ── Expanded panel ── */}
      {open && (
        <div className="border-t-2 border-[#1a1a1a] bg-[#fcfaf8] p-6 pb-5 anim-expand-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT SIDE DETAILS */}
            <div className="flex flex-col gap-6">
              {/* Contact Details */}
              <section className="bg-[#faf8f5] border-2 border-[#1a1a1a] p-4 shadow-[2px_2px_0px_#1a1a1a]">
                <SectionLabel>Contact Registry</SectionLabel>
                <div className="mt-1 flex flex-col gap-1.5 border-t border-[#1a1a1a] pt-3">
                  <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Email">
                    <span className="font-mono text-[#c2593f] text-xs font-black underline decoration-1 decoration-solid decoration-[#1a1a1a]">{p.email}</span>
                  </InfoRow>
                  <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} label="Location">
                    {p.location}
                  </InfoRow>
                  <InfoRow icon={<Building className="w-3.5 h-3.5" />} label="Company">
                    {p.company} &middot; <span className="font-mono text-[10px] text-slate-500 font-bold">{p.companySize}</span>
                  </InfoRow>
                  {p.revenue && (
                    <InfoRow icon={<Sparkles className="w-3.5 h-3.5" />} label="Revenue">
                      <span className="font-mono text-xs">{p.revenue}</span>
                    </InfoRow>
                  )}
                </div>
              </section>

              {/* Personalization Hooks */}
              {p.hooks?.length > 0 && (
                <section className="bg-[#faf8f5] border-2 border-[#1a1a1a] p-4 shadow-[2px_2px_0px_#1a1a1a]">
                  <SectionLabel>Personalization Hooks</SectionLabel>
                  <div className="mt-1 flex flex-col gap-3 border-t border-[#1a1a1a] pt-3">
                    {p.hooks.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs text-[#1a1a1a] leading-relaxed font-sans font-semibold">
                        <span className="text-[#c2593f] shrink-0 font-mono font-bold select-none">[✦]</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Pain Points & Tech Stack Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {p.painPoints?.length > 0 && (
                  <section className="bg-[#faf8f5] border-2 border-[#1a1a1a] p-4 shadow-[2px_2px_0px_#1a1a1a]">
                    <SectionLabel>Pain Points</SectionLabel>
                    <div className="mt-1 flex flex-wrap gap-1.5 border-t border-[#1a1a1a] pt-3">
                      {p.painPoints.map((pt, i) => (
                        <Tag key={i} variant="red">
                          {pt}
                        </Tag>
                      ))}
                    </div>
                  </section>
                )}
                {p.techStack?.length > 0 && (
                  <section className="bg-[#faf8f5] border-2 border-[#1a1a1a] p-4 shadow-[2px_2px_0px_#1a1a1a]">
                    <SectionLabel>Tech Stack</SectionLabel>
                    <div className="mt-1 flex flex-wrap gap-1.5 border-t border-[#1a1a1a] pt-3">
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

            {/* RIGHT SIDE — AI Outreach Message Editor */}
            <div className="bg-[#faf8f5] border-2 border-[#1a1a1a] p-5 flex flex-col gap-4 relative shadow-[4px_4px_0px_#1a1a1a]">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <SectionLabel>AI Outreach Composer</SectionLabel>
                <div className="flex bg-[#f4efe6] border-2 border-[#1a1a1a] p-0.5 rounded-none shadow-[1px_1px_0px_#1a1a1a]">
                  {["email", "linkedin"].map((t) => (
                    <button
                      id={`channel-tab-${t}-${index}`}
                      key={t}
                      onClick={() => {
                        setTab(t);
                        setMsg(null);
                      }}
                      className={`px-3 py-1 text-[11px] font-bold font-sans rounded-none transition-all flex items-center gap-1.5 border-none cursor-pointer ${
                        tab === t
                          ? "bg-[#faf8f5] text-[#c2593f] border-2 border-[#1a1a1a] shadow-[1px_1px_0px_#1a1a1a]"
                          : "bg-transparent text-slate-500 hover:text-[#1a1a1a]"
                      }`}
                    >
                      {t === "email" ? (
                        <>
                          <Mail className="w-3 h-3" /> EMAIL
                        </>
                      ) : (
                        <>
                          LINKEDIN
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Workspace Panel */}
              {!msg && !loading && (
                <div className="flex-1 flex flex-col justify-center items-center py-10 border-2 border-dashed border-[#1a1a1a] bg-[#fcfaf8]">
                  <Sparkles className="w-8 h-8 text-[#c2593f] mb-3 animate-pulse" />
                  <p className="text-xs text-[#1a1a1a] font-sans font-extrabold mb-4 text-center px-4 uppercase tracking-wide">
                    COMPILE PERSISTENT SALES OUTBOUND DRAFT
                  </p>
                  <button
                    id={`generate-outreach-button-${index}`}
                    onClick={() => generate(tab)}
                    className="neo-button-primary py-2.5 px-5 text-xs font-bold font-sans active:translate-y-[1px]"
                  >
                    Generate {tab === "email" ? "Email Draft" : "InMail Hook"}
                  </button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex-1 flex flex-col justify-center items-center py-14 bg-[#fcfaf8] border-2 border-[#1a1a1a] font-sans text-xs font-extrabold text-[#1a1a1a] uppercase tracking-wider">
                  <Spinner className="mb-3 w-5 h-5 text-[#c2593f]" />
                  <span>Compiling message vectors for {p.name.toUpperCase()}...</span>
                </div>
              )}

              {/* Output Content (Styled like an IDE) */}
              {msg && !msg.error && (
                <div className="flex flex-col gap-4 flex-1">
                  {msg.channel === "email" && (
                    <div className="flex flex-col gap-3 flex-1">
                      {/* Subject field (sleek grid format) */}
                      <div className="bg-[#f4efe6] border-2 border-[#1a1a1a] p-3 flex gap-3 items-center shadow-[2px_2px_0px_#1a1a1a]">
                        <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500 w-12 shrink-0 border-r-2 border-[#1a1a1a] pr-2.5">
                          SUBJECT
                        </div>
                        <div className="text-xs font-bold text-[#c2593f] font-sans flex-1 truncate">{msg.subject}</div>
                      </div>

                      {/* Code Scroll Pane for Email Body */}
                      <EditorLayout 
                        title={`outreach_${p.name.toLowerCase().replace(/ /g, "_")}.eml`}
                        content={msg.body}
                        type="email-body"
                      />
                    </div>
                  )}
                  {msg.channel === "linkedin" && (
                    <div className="flex flex-col gap-3 flex-1">
                      <EditorLayout 
                        title={`connection_note_${p.name.toLowerCase().replace(/ /g, "_")}.txt`}
                        content={msg.message}
                        type="text"
                      />
                      <div className="text-[10px] font-mono text-slate-500 text-right mt-1 font-bold">
                        CHARACTER COUNT: <span className="text-[#1a1a1a] font-black">{msg.message?.length || 0}</span> / 300
                      </div>
                    </div>
                  )}

                  {/* Actions (Copy / Retry) */}
                  <div className="flex gap-2">
                    <button
                      id={`copy-message-button-${index}`}
                      onClick={() => copy(msgText)}
                      className={`flex-1 py-2.5 px-3 text-xs font-bold font-sans uppercase tracking-wider rounded-none border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        copied
                          ? "bg-[#e0f2e9] border-[#4d7c5f] text-[#2e5a44]"
                          : "neo-button-secondary"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> COPIED!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> COPY RAW CONTENT
                        </>
                      )}
                    </button>
                    <button
                      id={`retry-message-button-${index}`}
                      onClick={() => {
                        setMsg(null);
                        generate(tab);
                      }}
                      className="neo-button-secondary py-2.5 px-4 text-xs font-bold active:translate-y-[1px]"
                    >
                      <RotateCw className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                </div>
              )}

              {/* Error Handling */}
              {msg?.error && (
                <p className="text-[#942e29] text-xs font-mono bg-[#fce8e6] border-2 border-[#1a1a1a] p-3 leading-normal shadow-[2px_2px_0px_#1a1a1a]">
                  ⚠️ COMPILER ERROR: {msg.error}
                </p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
