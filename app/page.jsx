"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, ArrowLeft, Download, X, Zap, Cpu } from "lucide-react";
import Spinner from "@/components/Spinner";
import SkeletonRow from "@/components/SkeletonRow";
import ProspectRow from "@/components/ProspectRow";

// ── Suggestions (focused on Pakistan tech & manufacturing hubs) ──────────────────────────────────
const SUGGESTIONS = [
  "Software houses in Lahore",
  "SaaS founders & CEOs in Karachi",
  "E-commerce store creators in Islamabad",
  "Textile manufacturing executives in Faisalabad",
  "CTOs at fintech startups in Pakistan",
  "Marketing agency directors in Karachi & Lahore",
];

// ── CSV export ─────────────────────────────────────────────────────────────────
function exportCSV(prospects) {
  const headers = ["Name", "Title", "Company", "Industry", "Location", "Email", "Phone", "LinkedIn", "Company Size", "Revenue", "Confidence"];
  const rows = prospects.map((p) => [
    p.name,
    p.title,
    p.company,
    p.industry,
    p.location,
    p.email,
    p.phone || "",
    p.linkedin || "",
    p.companySize,
    p.revenue || "",
    p.confidence,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
    download: `prospects-${Date.now()}.csv`,
  });
  a.click();
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [prospects, setProspects] = useState([]);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const inputRef = useRef(null);

  // auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const avgConf = prospects.length
    ? Math.round(prospects.reduce((a, p) => a + p.confidence, 0) / prospects.length)
    : 0;

  const runSearch = async (q) => {
    const sq = (q || query).trim();
    if (!sq) return;
    setLoading(true);
    setError(null);
    setProspects([]);
    setSearched(false);
    setLastQuery(sq);
    try {
      const res = await fetch("/api/find-prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: sq }),
      });
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      setProspects(d.prospects || []);
      setSearched(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
    setLoading(false);
  };

  const reset = () => {
    setSearched(false);
    setProspects([]);
    setQuery("");
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  return (
    <>
      {/* ── Topnav ── */}
      <header className="sticky top-0 z-50 bg-[#faf8f5] border-b-2 border-[#1a1a1a]">
        <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-[32px] h-[32px] bg-[#c2593f] border-2 border-[#1a1a1a] flex items-center justify-center shadow-[2px_2px_0px_#1a1a1a]">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="font-sans font-extrabold text-base tracking-tight text-[#1a1a1a] uppercase">
              PROSPECT<span className="text-[#c2593f]">HALO</span>
            </span>
          </div>
          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-[#1a1a1a] font-bold bg-[#f4efe6] border-2 border-[#1a1a1a] px-2.5 py-1">
              <Cpu className="w-3.5 h-3.5 text-[#c2593f]" />
              <span>gpt-oss-120b &middot; groq</span>
            </div>
            <div className="flex items-center gap-2 bg-[#f4efe6] border-2 border-[#1a1a1a] px-2.5 py-1">
              <span className="w-2 h-2 rounded-none bg-[#2e5a44] anim-pulse" />
              <span className="text-[10px] text-[#1a1a1a] font-mono font-bold uppercase tracking-wider">LIVE NODE</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Page body ── */}
      <main className="max-w-[1100px] mx-auto px-6 pb-24">
        
        {/* ── HERO (pre-search) ── */}
        {!searched && !loading && (
          <div className="text-center py-16 md:py-24 anim-fade-up">
            {/* Status pill */}
            <div className="inline-flex items-center gap-1.5 bg-[#f4efe6] border-2 border-[#1a1a1a] px-4 py-1.5 mb-8 text-[11px] text-[#1a1a1a] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#1a1a1a]">
              <Sparkles className="w-3.5 h-3.5 text-[#c2593f]" /> B2B Prospect Intel Pipeline
            </div>

            {/* Headline */}
            <h1 className="font-serif italic font-medium text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#1a1a1a] mb-6 leading-[1.12]">
              Describe your customer. <br />
              <span className="text-[#c2593f] not-italic font-extrabold font-sans underline decoration-[3px] decoration-solid decoration-[#1a1a1a]">AI Finds them for YOU.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#4a4a4a] leading-relaxed max-w-lg mx-auto mb-12 font-medium font-sans">
              Type your ideal target profile. We crawl live search databases to compile verified prospect profiles with exact emails, personalized hooks, and custom campaign messages.
            </p>
          </div>
        )}

        {/* ── Results header ── */}
        {searched && (
          <div className="flex flex-col md:flex-row md:items-center justify-between py-8 pb-6 gap-4 flex-wrap anim-fade-in">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                id="new-search-back-button"
                onClick={reset}
                className="neo-button-secondary py-2 px-4 text-xs font-bold font-sans active:translate-y-[1px]"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#c2593f] inline mr-1" /> New Search
              </button>
              <div className="font-mono text-sm font-bold uppercase tracking-wider text-[#1a1a1a] bg-[#f4efe6] border-2 border-[#1a1a1a] px-3 py-2 shadow-[2px_2px_0px_#1a1a1a]">
                <span>{prospects.length} targets matched</span>
                <span className="mx-2">&middot;</span>
                <span className="text-[#c2593f]">{avgConf}% match confidence avg</span>
              </div>
              <div className="bg-[#f4efe6] border-2 border-[#1a1a1a] px-3 py-2 text-xs text-[#1a1a1a] font-mono italic max-w-[280px] truncate shadow-[2px_2px_0px_#1a1a1a]">
                &ldquo;{lastQuery}&rdquo;
              </div>
            </div>
            <button
              id="csv-export-button"
              onClick={() => exportCSV(prospects)}
              className="neo-button-primary py-2.5 px-4 text-xs font-bold font-sans active:translate-y-[1px]"
            >
              <Download className="w-3.5 h-3.5 text-white inline mr-1" /> Export CSV
            </button>
          </div>
        )}

        {/* ── Search bar ── */}
        <div className="relative mb-8">
          <div
            className={`flex items-center bg-[#faf8f5] border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] transition-all duration-150 overflow-hidden tactile-input-focus ${
              loading
                ? "transform translate-x-[-1px] translate-y-[-1px] shadow-[5px_5px_0px_#1a1a1a]"
                : ""
            }`}
          >
            <div className="pl-4 pr-2 text-[#1a1a1a] flex items-center shrink-0 font-sans text-xs font-black uppercase select-none tracking-wider border-r-2 border-[#1a1a1a] h-12 mr-3 bg-[#f4efe6] px-3">
              {loading ? <Cpu className="w-4 h-4 text-[#c2593f] animate-spin" /> : "PROMPT"}
            </div>
            <input
              id="search-query-input"
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
              disabled={loading}
              placeholder='e.g. "Software houses in Lahore" or "SaaS founders in Karachi"'
              className="flex-1 bg-transparent border-none outline-none text-[#1a1a1a] font-sans py-4 px-2 text-sm md:text-base placeholder-slate-400 font-bold"
            />
            {query && !loading && (
              <button
                id="query-clear-button"
                onClick={() => setQuery("")}
                className="bg-transparent border-none cursor-pointer text-slate-500 hover:text-[#1a1a1a] px-2 flex items-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              id="search-submit-button"
              onClick={() => runSearch()}
              disabled={loading || !query.trim()}
              className={`border-l-2 border-[#1a1a1a] border-y-none border-r-none px-6 py-4 text-xs font-bold uppercase tracking-wider font-sans flex items-center gap-2 transition-all shrink-0 cursor-pointer h-full ${
                loading || !query.trim()
                  ? "bg-[#efeae2] text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-[#f3b13c] hover:bg-[#dca034] text-[#1a1a1a] active:bg-[#c68a1b]"
              }`}
            >
              {loading ? (
                <>
                  <Spinner className="w-3.5 h-3.5 border-2 border-[#1a1a1a]/20 border-t-[#1a1a1a] rounded-full animate-spin shrink-0" /> Scraping...
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 text-[#1a1a1a] stroke-[2.5px]" /> Scan Targets
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Suggestion chips (Pakistan tech focus) ── */}
        {!searched && !loading && (
          <div className="hidden sm:flex flex-wrap gap-3 mb-16 anim-fade-up justify-center" style={{ animationDelay: "120ms" }}>
            <span className="text-[#1a1a1a] text-xs font-bold self-center mr-1 uppercase tracking-wider">Target sectors:</span>
            {SUGGESTIONS.map((s, i) => (
              <button
                id={`suggest-chip-${i}`}
                key={s}
                className="suggest-chip"
                onClick={() => {
                  setQuery(s);
                  runSearch(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── How it works (pre-search only) ── */}
        {!searched && !loading && (
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 anim-fade-up" style={{ animationDelay: "200ms" }}>
            {[
              {
                n: "01",
                title: "Describe Profile",
                body: "Type target criteria in plain English. The compiler extracts exact role definitions and geographic variables.",
              },
              {
                n: "02",
                title: "Live Web Grounding",
                body: "GPT-OSS crawls active search indexes in real-time. We extract actual B2B contacts, preventing profile hallucinations.",
              },
              {
                n: "03",
                title: "Outreach Dossier",
                body: "Retrieve validated target records, verified contact emails, pain-point tags, and custom campaign compositions.",
              },
            ].map((s) => (
              <article key={s.n} className="bg-[#f4efe6] border-2 border-[#1a1a1a] p-6 shadow-[4px_4px_0px_#1a1a1a] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1a1a1a] transition-all duration-150">
                <div className="font-mono text-xs font-bold text-[#c2593f] border-b border-[#1a1a1a] pb-2 mb-4 uppercase tracking-widest">{s.n} / B2B Pipeline</div>
                <h3 className="font-sans text-[15px] font-black text-[#1a1a1a] mb-2">{s.title}</h3>
                <p className="text-xs text-[#4a4a4a] leading-relaxed font-sans font-medium">{s.body}</p>
              </article>
            ))}
          </section>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-[#fce8e6] border-2 border-[#1a1a1a] text-[#942e29] font-mono text-xs shadow-[2px_2px_0px_#1a1a1a] p-4 mb-6 flex items-center gap-2 anim-fade-in">
            ⚠️ SYSTEM ERROR: {error}
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading && (
          <section>
            <div className="flex items-center gap-2.5 text-[#1a1a1a] text-xs font-mono font-bold mb-6 uppercase tracking-wider bg-[#f4efe6] border-2 border-[#1a1a1a] p-3.5 shadow-[2px_2px_0px_#1a1a1a]">
              <Spinner className="text-[#c2593f]" />
              <span>CRAWLING B2B TARGET CHANNELS FOR &ldquo;{lastQuery.toUpperCase()}&rdquo;...</span>
            </div>
            <div className="flex flex-col gap-3">
              {[...Array(6)].map((_, i) => (
                <SkeletonRow key={i} delay={i * 60} />
              ))}
            </div>
          </section>
        )}

        {/* ── Results list ── */}
        {searched && prospects.length > 0 && (
          <section>
            {/* Hint bar */}
            <div className="bg-[#f9eae6] border-2 border-[#1a1a1a] text-[#c2593f] font-sans text-xs font-bold p-4 shadow-[2px_2px_0px_#1a1a1a] mb-6 flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c2593f]" />
              <span>Select any dossier row to compile custom email drafts, view technical stacks, or trigger LinkedIn outreach scripts.</span>
            </div>

            <div className="flex flex-col gap-4">
              {prospects.map((p, i) => (
                <ProspectRow key={i} p={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
