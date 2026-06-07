"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, ArrowLeft, Download, X, Zap } from "lucide-react";
import Spinner from "@/components/Spinner";
import SkeletonRow from "@/components/SkeletonRow";
import ProspectRow from "@/components/ProspectRow";

// ── Suggestions ───────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "SaaS CTOs at Series A startups in New York",
  "Roofing company owners in Florida",
  "E-commerce founders doing $1M–$10M revenue",
  "HR Directors at 200-500 person companies in London",
  "Real estate agents in California with 5+ years experience",
  "Restaurant owners in Chicago with multiple locations",
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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1100px] mx-auto px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-serif text-[19px] font-semibold text-slate-900 tracking-tight">
              ProspectHalo
            </span>
          </div>
          {/* Right */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">
              openai/gpt-oss-120b via Groq
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
          </div>
        </div>
      </header>

      {/* ── Page body ── */}
      <main className="max-w-[1100px] mx-auto px-8 pb-20">
        
        {/* ── HERO (pre-search) ── */}
        {!searched && !loading && (
          <div className="text-center py-16 md:py-24 anim-fade-up">
            {/* Status pill */}
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-full px-3.5 py-1 mb-7 text-xs text-indigo-600 font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> AI prospect intelligence
            </div>

            {/* Headline */}
            <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight text-slate-900 mb-5">
              Describe your customer.{" "}
              <em className="not-italic text-indigo-600">AI finds them.</em>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg mx-auto mb-10 font-normal font-sans">
              Type who you want in plain English. Get 10 verified prospects with contact details and personalized outreach &mdash; in seconds.
            </p>
          </div>
        )}

        {/* ── Results header ── */}
        {searched && (
          <div className="flex flex-col md:flex-row md:items-center justify-between py-8 pb-5 gap-4 flex-wrap anim-fade-in">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 rounded-lg px-3 py-1.5 text-xs text-slate-600 cursor-pointer transition-all font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> New search
              </button>
              <div>
                <span className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                  {prospects.length}
                </span>
                <span className="text-slate-400 text-xs ml-1.5 font-sans font-semibold">prospects &middot; avg {avgConf}% match</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-500 italic max-w-[280px] truncate">
                &ldquo;{lastQuery}&rdquo;
              </div>
            </div>
            <button
              onClick={() => exportCSV(prospects)}
              className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-600 cursor-pointer transition-all font-sans"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        )}

        {/* ── Search bar ── */}
        <div className="relative mb-5">
          <div
            className={`flex items-center bg-white border-2 rounded-xl shadow-sm transition-all duration-200 overflow-hidden ${
              loading
                ? "border-indigo-600 ring-4 ring-indigo-600/10 shadow-md"
                : searched
                ? "border-slate-200"
                : "border-slate-300 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/10"
            }`}
          >
            <div className="pl-4 pr-3 text-slate-300 flex items-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
              disabled={loading}
              placeholder='e.g. "SaaS CTOs at Series A startups in New York"'
              className="flex-1 bg-transparent border-none outline-none text-slate-900 font-sans py-3.5 text-base placeholder-slate-400"
            />
            {query && !loading && (
              <button
                onClick={() => setQuery("")}
                className="bg-transparent border-none cursor-pointer text-slate-300 hover:text-slate-500 px-2 flex items-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => runSearch()}
              disabled={loading || !query.trim()}
              className={`border-none px-5 py-2.5 m-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer font-sans ${
                loading || !query.trim()
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
              }`}
            >
              {loading ? (
                <>
                  <Spinner className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" /> Searching...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Find Prospects
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Suggestion chips ── */}
        {!searched && !loading && (
          <div className="hidden sm:flex flex-wrap gap-2 mb-16 anim-fade-up justify-center" style={{ animationDelay: "150ms" }}>
            <span className="text-slate-400 text-xs self-center mr-1 font-semibold">Try:</span>
            {SUGGESTIONS.map((s) => (
              <button
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16 anim-fade-up" style={{ animationDelay: "250ms" }}>
            {[
              {
                n: "01",
                title: "Describe",
                body: "Type your ideal customer in plain English. No forms, no filters, just a sentence.",
              },
              {
                n: "02",
                title: "AI finds them",
                body: "GPT-OSS 120B returns 10 verified prospects with real contact details and personalization hooks.",
              },
              {
                n: "03",
                title: "Send",
                body: "Generate a personalized email or LinkedIn message per prospect with one click.",
              },
            ].map((s) => (
              <div key={s.n} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="font-mono text-[10px] text-slate-400 mb-2.5 tracking-wider">{s.n}</div>
                <div className="font-serif text-[17px] font-semibold text-slate-900 mb-2">{s.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{s.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-xs font-semibold mb-5 flex items-center gap-2 anim-fade-in">
            ⚠️ {error}
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading && (
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-4">
              <Spinner />
              <span>Searching for prospects matching <em>&ldquo;{lastQuery}&rdquo;</em>...</span>
            </div>
            <div className="flex flex-col gap-2">
              {[...Array(6)].map((_, i) => (
                <SkeletonRow key={i} delay={i * 60} />
              ))}
            </div>
          </div>
        )}

        {/* ── Results list ── */}
        {searched && prospects.length > 0 && (
          <>
            {/* Hint bar */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg px-3.5 py-2 text-xs text-indigo-600/90 font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Click any row to expand the profile and generate a personalized AI message.
            </div>

            <div className="flex flex-col gap-2">
              {prospects.map((p, i) => (
                <ProspectRow key={i} p={p} index={i} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
