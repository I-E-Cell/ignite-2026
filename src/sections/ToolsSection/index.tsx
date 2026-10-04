import React from "react";
import { LogoLoop, type LogoItem } from "@/components/ui/LogoLoop";
import { Cpu, Zap, Sparkles } from "lucide-react";

/* ─── Row 1: Agentic Platforms, AI IDEs & Foundation Models ─── */
const rowOneTools: LogoItem[] = [
  {
    id: "antigravity",
    name: "Antigravity",
    category: "Google DeepMind Agent",
    iconSrc: "/assets/tools/antigravity.svg",
    url: "https://antigravity.google",
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "AI Code Editor",
    iconSrc: "/assets/tools/cursor.svg",
    url: "https://www.cursor.com",
  },
  {
    id: "hermes",
    name: "Hermes",
    category: "Nous Autonomous Agent",
    iconSrc: "/assets/tools/hermes.svg",
    url: "https://nousresearch.com",
  },
  {
    id: "codex",
    name: "OpenAI Codex",
    category: "Code Generation",
    iconSrc: "/assets/tools/openai.svg",
    url: "https://openai.com",
  },
  {
    id: "claude",
    name: "Claude",
    category: "Anthropic 3.5 Sonnet",
    iconSrc: "/assets/tools/claude.svg",
    url: "https://claude.ai",
  },
  {
    id: "v0",
    name: "v0",
    category: "Vercel Generative UI",
    iconSrc: "/assets/tools/v0.svg",
    url: "https://v0.dev",
  },
  {
    id: "bolt",
    name: "Bolt.new",
    category: "StackBlitz In-Browser Dev",
    iconSrc: "/assets/tools/bolt.svg",
    url: "https://bolt.new",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "Open-Source Hub",
    iconSrc: "/assets/tools/huggingface.svg",
    url: "https://huggingface.co",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    category: "Reasoning Architecture",
    iconSrc: "/assets/tools/deepseek.svg",
    url: "https://www.deepseek.com",
  },
];

/* ─── Row 2: Visual Builders, Cloud Backends & Workflow Engines ─── */
const rowTwoTools: LogoItem[] = [
  {
    id: "supabase",
    name: "Supabase",
    category: "Serverless Postgres",
    iconSrc: "/assets/tools/supabase.svg",
    url: "https://supabase.com",
  },
  {
    id: "bubble",
    name: "Bubble",
    category: "Full-Stack No-Code",
    iconSrc: "/assets/tools/bubble.svg",
    url: "https://bubble.io",
  },
  {
    id: "webflow",
    name: "Webflow",
    category: "Visual Frontend & CMS",
    iconSrc: "/assets/tools/webflow.svg",
    url: "https://webflow.com",
  },
  {
    id: "airtable",
    name: "Airtable",
    category: "Relational Database",
    iconSrc: "/assets/tools/airtable.svg",
    url: "https://airtable.com",
  },
  {
    id: "ollama",
    name: "Ollama",
    category: "Local Model Runner",
    iconSrc: "/assets/tools/ollama.svg",
    url: "https://ollama.com",
  },
  {
    id: "replit",
    name: "Replit",
    category: "Collaborative Workspace",
    iconSrc: "/assets/tools/replit.svg",
    url: "https://replit.com",
  },
  {
    id: "llama",
    name: "Meta Llama",
    category: "Open Foundation Model",
    iconSrc: "/assets/tools/llama.svg",
    url: "https://www.llama.com",
  },
  {
    id: "n8n",
    name: "n8n",
    category: "Workflow Automation",
    iconSrc: "/assets/tools/n8n.svg",
    url: "https://n8n.io",
  },
  {
    id: "postman",
    name: "Postman",
    category: "API Workspace",
    iconSrc: "/assets/tools/postman.svg",
    url: "https://www.postman.com",
  },
];

export const ToolsSection: React.FC = () => {
  return (
    <section
      id="tools"
      aria-label="Supported No-Code and AI Developer Tools"
      className="relative w-full pt-16 pb-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-transparent text-white overflow-hidden z-20"
    >
      {/* Background glow atmosphere */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto flex flex-col items-center relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center mb-12 sm:mb-16">
          <span
            className="block text-center mb-3 font-bold text-xs uppercase tracking-[1.4px]"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "#A8A69B",
            }}
          >
            (The Builder&apos;s Toolkit)
          </span>

          <h2
            className="tracking-tight leading-[1.12] text-[#FBFAF8] text-center"
            style={{
              fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.1rem, 4.8vw, 50px)",
              letterSpacing: "-0.025em",
            }}
          >
            Build Real Startups Without Backend Code.
          </h2>

          <p
            className="mt-4 text-stone-400 text-sm sm:text-base max-w-2xl text-center leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            No CS degree required. Leverage agentic AI platforms, autonomous coding tools, and visual builders
            to ship working MVPs, acquire real users, and win from the ₹1,00,000 grant pool.
          </p>
        </div>

        {/* ─── Dual React Bits LogoLoop Marquees (Clean Unboxed Logos) ─── */}
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Row 1: Leftward Marquee (Agents & LLM Tooling) */}
          <div className="w-full">
            <LogoLoop items={rowOneTools} direction="left" speed={38} pauseOnHover={true} />
          </div>

          {/* Row 2: Rightward Marquee (Visual Builders & Backends) */}
          <div className="w-full">
            <LogoLoop items={rowTwoTools} direction="right" speed={42} pauseOnHover={true} />
          </div>
        </div>

        {/* ─── Value Props / Highlights Bar ─── */}
        <div className="mt-14 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-8">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-transparent border border-white/5 hover:border-white/10 transition-colors">
            <div className="shrink-0 text-white mt-0.5">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-geist_mono">
                Zero Barrier to Entry
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-snug">
                You bring domain intuition and user friction; visual builders handle deployment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-transparent border border-white/5 hover:border-white/10 transition-colors">
            <div className="shrink-0 text-white mt-0.5">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-geist_mono">
                Agentic Workflows
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-snug">
                Learn modern pair programming with Antigravity, Cursor, and Hermes autonomous loops.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-transparent border border-white/5 hover:border-white/10 transition-colors">
            <div className="shrink-0 text-white mt-0.5">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-geist_mono">
                Production Viability
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-snug">
                Launch real Postgres databases, custom domains, and automated customer pipelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
