import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

interface TrackData {
  id: string;
  num: string;
  name: string;
  seat: string;
  tagline: string;
  summary: string;
  prompts: string[];
}

const tracks: TrackData[] = [
  {
    id: "ai",
    num: "01",
    name: "AI & Intelligent Systems",
    seat: "Seat 01",
    tagline: "Kill the wrapper. Build intelligence that actually thinks, reasons, and executes.",
    summary:
      "Stop building glorified prompt wrappers. Engineer multi-agent swarms, local edge models running with zero latency, autonomous execution loops, and neuro-symbolic engines that solve deep real-world chaos.",
    prompts: [
      "Autonomous agent swarms executing real-world action loops",
      "Sub-second edge AI and zero-cloud local reasoning engines",
      "Neuro-symbolic pipelines that eradicate hallucinations",
    ],
  },
  {
    id: "fintech",
    num: "02",
    name: "FinTech & Digital Innovation",
    seat: "Seat 02",
    tagline: "Reinvent money, transactions, and verifiable value exchange.",
    summary:
      "Build the next frontier of financial primitives, fraud-proof transaction layers, algorithmic risk models, and localized payment infrastructure built for high-throughput resilience.",
    prompts: [
      "Zero-knowledge transaction validation and automated compliance",
      "Micro-lending protocols powered by verifiable real-time cash flow data",
      "Real-time fraud anomaly detectors with sub-5ms inference latency",
    ],
  },
  {
    id: "healthtech",
    num: "03",
    name: "HealthTech & Wellness",
    seat: "Seat 03",
    tagline: "Bridge patient care, clinical diagnostics, and preventative intelligence.",
    summary:
      "Design systems that empower physicians and individuals: medical imaging analytics, remote biometric monitoring, privacy-preserving health data synthesis, and preventative wellness engines.",
    prompts: [
      "On-device diagnostic assistants for low-connectivity clinics",
      "Federated learning frameworks for sensitive patient telemetry",
      "Personalized preventative care routines derived from longitudinal biometric streams",
    ],
  },
  {
    id: "cybersecurity",
    num: "04",
    name: "Cybersecurity & Digital Trust",
    seat: "Seat 04",
    tagline: "Defend against adversarial systems and protect user sovereignty.",
    summary:
      "Harden modern attack surfaces: real-time exploit intelligence, automated binary analysis, post-quantum cryptographic schemes, and resilient zero-trust architecture.",
    prompts: [
      "Autonomous defense honeypots that generate targeted mitigation signatures",
      "Cryptographic proof of personhood and deepfake detection pipelines",
      "Supply chain vulnerability auditing for distributed dependencies",
    ],
  },
  {
    id: "web3",
    num: "05",
    name: "Web3 & Blockchain",
    seat: "Seat 05",
    tagline: "Decentralized state machines, local-first protocols, and self-custody.",
    summary:
      "Construct sovereign tools without middle-men: cross-chain interoperability, decentralized identity protocols, verifiable computation, and decentralized physical infrastructure (DePIN).",
    prompts: [
      "DePIN architectures linking distributed IoT telemetry with smart contracts",
      "Account abstraction UX enabling seamless web2-to-web3 onboarding",
      "Decentralized consensus mechanisms optimized for high latency edge nodes",
    ],
  },
  {
    id: "open",
    num: "06",
    name: "Open Innovation",
    seat: "Seat 06",
    tagline: "Break boundaries. Solve the unsolvable problems.",
    summary:
      "For builders who refuse to be pigeonholed. Build radical climate solutions, urban mobility systems, educational tools, or novel software architectures that defy conventional categorization.",
    prompts: [
      "Hyper-localized community infrastructure and disaster response networks",
      "Creative coding, spatial computing, and accessible sensory interfaces",
      "Radical tools for thought, distributed learning, and cooperative ownership",
    ],
  },
];

export const TracksSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentTrack = tracks[activeIdx];

  return (
    <section
      id="themes"
      aria-label="The six tracks"
      className="box-border caret-transparent relative w-full pt-16 pb-20 px-5 text-center text-lime-50 scroll-mt-20 md:pt-28 md:pb-28 md:px-16"
    >
      <div id="tracks" className="relative -top-14 h-0 pointer-events-none" aria-hidden="true" />
      
      <div className="max-w-[1376px] mx-auto flex flex-col items-center">
        <SectionHeader variant="artifactOnly" title="" />
        
        <SectionHeader
          variant="tracks"
          eyebrow="The six tracks"
          titleLineOne="Six directions"
          titleLineTwo="to build in."
          descriptionWords={[
            "One",
            "seat",
            "at",
            "the",
            "table",
            "for",
            "each.",
            "Pick",
            "the",
            "one",
            "you",
            "cannot",
            "stop",
            "thinking",
            "about",
            "—",
            "every",
            "track",
            "is",
            "judged",
            "on",
            "the",
            "same",
            "four",
            "criteria.",
          ]}
        />

        {/* Stage Container */}
        <div className="w-full mt-10 md:mt-16 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center bg-stone-950/60 p-6 md:p-10 rounded-3xl border border-lime-900/30 shadow-2xl backdrop-blur-sm">
            {/* Visual Morphing Plate */}
            <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-[#060B05] border border-lime-900/40 p-6 flex flex-col justify-between shadow-inner">
              <div className="flex justify-between items-center text-xs font-mono text-lime-400">
                <span className="text-3xl md:text-5xl font-bold font-headingNow text-lime-300">
                  {currentTrack.num}
                </span>
                <span className="px-3 py-1 bg-lime-950/80 rounded-full border border-lime-800/40 text-stone-300 uppercase tracking-wider text-[11px]">
                  Featured Track
                </span>
              </div>

              <div className="relative z-10 my-auto py-4">
                <span className="text-xs uppercase font-geist_mono tracking-widest text-lime-400 block mb-2">
                  {currentTrack.seat}
                </span>
                <h4 className="text-2xl md:text-3xl font-bold font-headingNow text-lime-50 leading-tight">
                  {currentTrack.name}
                </h4>
              </div>

              <div className="flex items-center justify-between text-stone-400 text-xs font-geist_mono pt-3 border-t border-lime-950">
                <span>AIT PUNE I&amp;E CELL</span>
                <span>IGNITE 2026</span>
              </div>

              {/* Ambient Glow */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Brief / Details */}
            <div className="flex flex-col justify-center space-y-5">
              <div>
                <span className="inline-block text-xs uppercase font-geist_mono text-lime-400 font-semibold tracking-wider">
                  {currentTrack.seat}
                </span>
                <h3 className="text-2xl md:text-4xl font-semibold font-headingNow text-lime-50 mt-1">
                  {currentTrack.name}
                </h3>
              </div>

              <div className="h-px w-full bg-lime-900/30" />

              <p className="text-stone-200 font-medium text-base md:text-lg leading-relaxed font-dm_sans">
                {currentTrack.tagline}
              </p>

              <p className="text-stone-300/80 text-sm md:text-base leading-relaxed font-dm_sans">
                {currentTrack.summary}
              </p>

              <div className="pt-2">
                <span className="text-xs uppercase font-geist_mono text-lime-400/80 font-semibold tracking-wider block mb-3">
                  Inspiration Prompts
                </span>
                <ul className="space-y-2.5">
                  {currentTrack.prompts.map((prompt, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-stone-200">
                      <span className="text-lime-400 mt-1 flex-shrink-0">◆</span>
                      <span>{prompt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Track Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center" role="tablist" aria-label="Tracks">
            {tracks.map((track, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={track.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs md:text-sm font-geist_mono transition-all duration-200 border ${
                    isActive
                      ? "bg-lime-400/20 text-lime-200 border-lime-400/50 shadow-sm"
                      : "bg-stone-900/50 text-stone-400 border-stone-800/80 hover:bg-stone-800/60 hover:text-stone-200"
                  }`}
                >
                  <span className={`font-bold ${isActive ? "text-lime-400" : "text-stone-500"}`}>
                    {track.num}
                  </span>
                  <span>{track.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
