import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useReducedMotion, type MotionValue } from "motion/react";

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

// Scroll-positioned pinning: CSS sticky can stop working inside overflow wrappers.
// Read the actual screen position, also supporting transform-based smooth scroll.
function useScene(ref: React.RefObject<HTMLDivElement | null>, reduced: boolean) {
  const progress = useMotionValue(0);
  const pinY = useMotionValue(0);
  useEffect(() => {
    if (reduced) { progress.set(0); pinY.set(0); return; }
    let frame = 0;
    let last = -1;
    const tick = () => {
      const element = ref.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const sceneHeight = element.firstElementChild?.getBoundingClientRect().height ?? window.innerHeight;
        const distance = Math.max(1, element.offsetHeight - sceneHeight);
        const travelled = Math.max(0, Math.min(distance, -rect.top));
        if (Math.abs(travelled - last) > 0.2) {
          pinY.set(travelled); progress.set(travelled / distance); last = travelled;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ref, reduced, progress, pinY]);
  return { progress, pinY };
}

// Five pieces, six tracks: Cybersecurity and Web3 share the fourth piece.
const groups = [[0], [1], [2], [3, 4], [5]];
const colors = ["#000", "#000", "#000", "#000", "#000"];

function TrackPiece({ index, progress, mobile }: { index: number; progress: MotionValue<number>; mobile: boolean }) {
  const start = 0.15 + index * 0.035;
  const rotateY = useTransform(progress, [start, start + 0.27], [0, 180]);
  const x = useTransform(progress, [0.08, 0.35], [0, (index - 2) * 16]);
  const y = useTransform(progress, [0.12, 0.5], [0, [30, -12, -30, -12, 30][index]]);
  const rotateZ = useTransform(progress, [0.12, 0.5], [0, [-7, -3, 0, 3, 7][index]]);
  const left = useTransform(progress, [0.1, 0.5], [`${index * 20}%`, `${(index % 2) * 52}%`]);
  const top = useTransform(progress, [0.1, 0.5], ["0%", `${Math.floor(index / 2) * 33}%`]);
  const width = useTransform(progress, [0.1, 0.5], ["20%", "48%"]);
  const height = useTransform(progress, [0.1, 0.5], ["80%", "30%"]);
  const light = index % 2 === 0;
  return (
    <motion.div className="it-piece" style={mobile ? { left, top, width, height } : { x, y, rotateZ }}>
      <motion.div className="it-flipper" style={{ rotateY }}>
        <div className="it-face it-front" style={{ backgroundPosition: `${index * 25}% center` }} aria-hidden="true" />
        <div className={`it-face it-back ${light ? "it-light" : "it-dark"}`} style={{ background: colors[index] }}>
          <span className="it-piece-label">IGNITE / 2026</span>
          <div className="it-piece-content">
            {groups[index].map((trackIndex) => (
              <div key={tracks[trackIndex].id} className="it-pick">
                <span className="it-track-num">{tracks[trackIndex].num} ↗</span>
                <span className="it-track-name">{tracks[trackIndex].name}</span>
              </div>
            ))}
          </div>
          <span className="it-piece-label">EXPLORE THE TRACK ↓</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const TracksSection = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 600);
  useEffect(() => {
    const mq = window.matchMedia("(max-width:599px)");
    const update = () => setMobile(mq.matches);
    update(); mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const currentTrack = tracks[activeIdx];
  const { progress: scrollYProgress, pinY } = useScene(stageRef, !!reduceMotion);
  const frontOpacity = useTransform(scrollYProgress, [0.08, 0.2], [1, 0]);
  const instructionOpacity = useTransform(scrollYProgress, [0.52, 0.65], [0, 1]);

  return (
    <section id="themes" className={`ignite-tracks ${reduceMotion ? "it-reduced" : ""}`} aria-label="The six tracks">
      <div id="tracks" className="it-anchor" />
      <div className="it-scroll" ref={stageRef}>
        <motion.div className="it-sticky" style={reduceMotion ? {} : { y: pinY }}>
          <header className="it-heading">
            <span className="it-eyebrow">THE SIX TRACKS</span>
            <h2>Six directions<br /><span>to build in.</span></h2>
            <p>One seat at the table for each. Pick the one you cannot stop thinking about - every track is judged on the same four criteria.</p>
          </header>
          <div className="it-deck" aria-hidden="true">
            {groups.map((_, i) => <TrackPiece key={i} index={i} progress={scrollYProgress} mobile={mobile} />)}
            <motion.div className="it-cover-copy" style={{ opacity: frontOpacity }}>
              <span>ONE SPARK. ENDLESS POSSIBILITIES.</span><strong>What will<br />you build?</strong><span>SCROLL TO UNFOLD ↓</span>
            </motion.div>
          </div>
          <motion.p className="it-instruction" style={{ opacity: instructionOpacity }}>Five pieces. Six tracks. Find your direction below.</motion.p>
          <div className="it-static-grid">
            {groups.map((group, i) => <div key={i} className={`it-static-card ${i % 2 === 0 ? "it-light" : "it-dark"}`} style={{ background: colors[i] }}>
              <span className="it-piece-label">IGNITE / 2026</span>
              {group.map(idx => <button type="button" key={idx} className="it-pick" aria-pressed={activeIdx === idx} onClick={() => setActiveIdx(idx)}><span className="it-track-num">{tracks[idx].num} ↗</span><span className="it-track-name">{tracks[idx].name}</span></button>)}
            </div>)}
          </div>
        </motion.div>
      </div>
      <div className="it-details-wrap">
        <div className="it-selector" aria-label="Choose a track">
          {tracks.map((track, idx) => <button key={track.id} type="button" aria-pressed={activeIdx === idx} onClick={() => setActiveIdx(idx)} className={activeIdx === idx ? "it-selected" : ""}><span>{track.num}</span> {track.name}</button>)}
        </div>
        <article className="it-details" aria-live="polite" aria-atomic="true">
          <div className="it-detail-title"><span className="it-eyebrow">{currentTrack.seat}</span><h3>{currentTrack.name}</h3><p>{currentTrack.tagline}</p><span className="it-credit">AIT PUNE I&amp;E CELL / IGNITE 2026</span></div>
          <div className="it-detail-body"><p>{currentTrack.summary}</p><h4>INSPIRATION PROMPTS</h4><ul>{currentTrack.prompts.map(prompt => <li key={prompt}>{prompt}</li>)}</ul></div>
        </article>
      </div>
      <style>{`
        .ignite-tracks{position:relative;background:#000;color:#eef4e6;font-family:'Inter',sans-serif;padding-bottom:90px;isolation:isolate;scroll-margin-top:80px}
        .ignite-tracks *{box-sizing:border-box}
        .it-anchor{position:absolute;top:0;scroll-margin-top:80px}
        .it-scroll{height:270svh;position:relative}
        .it-sticky{position:relative;height:100svh;min-height:660px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:70px 50px 30px;overflow:hidden}
        .it-heading{text-align:center;max-width:640px;position:relative;z-index:1}
        .it-eyebrow{font:10px 'Geist Mono',monospace;letter-spacing:.22em;color:#9dbc81;text-transform:uppercase}
        .it-heading h2{font-family:var(--font-headingNow),'Plus Jakarta Sans',sans-serif;font-size:clamp(42px,4.8vw,68px);font-weight:500;line-height:1.04;letter-spacing:-.05em;margin:20px 0}
        .it-heading h2 span{color:#c5e6a5}
        .it-heading p{color:#a8b5a0;font-size:13px;line-height:1.7;max-width:450px;margin:0 auto}
        .it-deck{display:flex;width:min(88%,1000px);height:clamp(255px,25vw,320px);margin-top:60px;position:relative;perspective:1800px}
        .it-piece{width:20%;height:100%;perspective:1400px;flex-shrink:0}
        .it-flipper{position:relative;width:100%;height:100%;transform-style:preserve-3d}
        .it-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
        .it-front{background:#000;border-top:1px solid #a6ce7e;border-bottom:1px solid #a6ce7e}
        .it-piece:first-child .it-front{border-radius:15px 0 0 15px;border-left:1px solid #a6ce7e}.it-piece:nth-child(5) .it-front{border-radius:0 15px 15px 0;border-right:1px solid #a6ce7e}
        .it-back{transform:rotateY(180deg);border:1px solid #a6ce7e;border-radius:12px;display:flex;flex-direction:column;justify-content:space-between;padding:20px 16px;box-shadow:0 14px 40px #0004}
        .it-light,.it-dark{color:#e8f1df}
        .it-piece-label{font:8px 'Geist Mono',monospace;letter-spacing:.12em;opacity:.75}
        .it-piece-content{display:flex;flex-direction:column;gap:24px}
        .it-pick{text-align:left;border:0;padding:0;background:none;color:inherit;width:100%;font-family:inherit;cursor:pointer}
        .it-track-num{display:block;font:11px 'Geist Mono',monospace;margin-bottom:12px;opacity:.7}
        .it-track-name{display:block;font-family:var(--font-headingNow),'Plus Jakarta Sans',sans-serif;font-size:clamp(18px,1.8vw,25px);line-height:1.14;font-weight:500;letter-spacing:-.035em}
        .it-cover-copy{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;pointer-events:none;text-align:center;color:#f1f5e9}
        .it-cover-copy span{font:9px 'Geist Mono',monospace;letter-spacing:.18em}.it-cover-copy strong{font-family:var(--font-headingNow),'Plus Jakarta Sans',sans-serif;font-size:clamp(40px,5vw,64px);line-height:1.04;font-weight:500;letter-spacing:-.05em}
        .it-instruction{font:10px 'Geist Mono',monospace;color:#9dbc81;margin:45px 0 0;text-align:center}
        .it-static-grid{display:none}
        .it-details-wrap{max-width:1200px;margin:auto;padding:25px 48px 0}
        .it-selector{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:40px}
        .it-selector button{font:11px 'Geist Mono',monospace;line-height:1.5;border:1px solid #60734b66;border-radius:24px;background:none;color:#a8b5a0;padding:11px 14px;cursor:pointer}
        .it-selector button span{margin-right:6px;color:#c5e6a5}.it-selector .it-selected{color:#e8f4dc;border-color:#aac989;background:#20351e}
        .ignite-tracks button:focus-visible{outline:2px solid #c5e6a5;outline-offset:5px}
        .it-details{display:grid;grid-template-columns:1fr 1.2fr;gap:65px;border-top:1px solid #60734b66;padding-top:45px}
        .it-detail-title h3{font-family:var(--font-headingNow),'Plus Jakarta Sans',sans-serif;font-size:clamp(32px,3.5vw,46px);font-weight:500;line-height:1.1;letter-spacing:-.045em;margin:18px 0 22px}
        .it-detail-title p{color:#c6d6b8;line-height:1.7;font-size:15px;max-width:370px;margin:0 0 30px}
        .it-credit{font:8px 'Geist Mono',monospace;letter-spacing:.12em;color:#8d9c81}
        .it-detail-body p{font-size:14px;line-height:1.85;color:#a8b5a0;margin:0 0 28px}
        .it-detail-body h4{font:10px 'Geist Mono',monospace;letter-spacing:.15em;color:#c5e6a5;margin:0 0 18px}
        .it-detail-body ul{margin:0;padding:0;list-style:none}.it-detail-body li{font-size:13px;line-height:1.7;color:#becbb4;margin:12px 0;padding-left:18px;position:relative}.it-detail-body li:before{content:'↗';position:absolute;left:0;color:#a6cb7c}
        @media(max-width:1023px){.it-sticky{padding:50px 12px 20px;min-height:620px}.it-heading h2{font-size:44px}.it-heading p{font-size:12px;max-width:340px;padding:0 12px}.it-deck{width:80%;height:270px;margin-top:50px}.it-back{padding:15px 8px}.it-track-name{font-size:17px;word-break:normal;overflow-wrap:anywhere}.it-piece-label{font-size:6px;letter-spacing:0}.it-track-num{font-size:9px}.it-details-wrap{padding:10px 24px 0}.it-selector{justify-content:flex-start;gap:7px;margin-bottom:30px}.it-selector button{font-size:10px;padding:9px 11px}.it-details{grid-template-columns:1fr;gap:30px;padding-top:30px}.it-detail-title h3{font-size:36px}.it-detail-title p{margin-bottom:22px}.it-instruction{max-width:280px;line-height:1.7}}
        @media(max-width:599px){.it-sticky{padding:65px 16px 20px;min-height:670px;justify-content:flex-start}.it-heading h2{font-size:32px;margin:12px 0}.it-heading p{font-size:10px;line-height:1.5}.it-deck{width:100%;height:440px;margin-top:25px;flex:none}.it-piece{position:absolute}.it-back{padding:12px 10px;border-radius:9px}.it-track-name{font-size:17px;line-height:1.05;overflow-wrap:normal}.it-piece-content{gap:12px}.it-piece-label{font-size:6px}.it-track-num{font-size:8px;margin-bottom:5px}.it-back>.it-piece-label:last-child{display:none}.it-instruction{margin-top:0;font-size:8px}.it-cover-copy{height:80%}.it-cover-copy strong{font-size:46px}.it-cover-copy span{font-size:8px}}
        @media(prefers-reduced-motion:reduce){.it-scroll{height:auto}.it-sticky{position:relative;height:auto;min-height:0;padding-top:70px}.it-deck,.it-instruction{display:none}.it-static-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;max-width:1100px;width:100%;margin:40px 0}.it-static-card{border:1px solid #a6ce7e;border-radius:12px;padding:20px 16px;min-height:280px;display:flex;flex-direction:column;gap:25px;justify-content:space-between}}
        @media(prefers-reduced-motion:reduce) and (max-width:1023px){.it-static-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.it-static-card{min-height:230px}}
        .it-reduced .it-scroll{height:auto}.it-reduced .it-sticky{position:relative;height:auto;min-height:0;padding-top:70px}.it-reduced .it-deck,.it-reduced .it-instruction{display:none}.it-reduced .it-static-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;max-width:1100px;width:100%;margin:40px 0}.it-reduced .it-static-card{border:1px solid #a6ce7e;border-radius:12px;padding:20px 16px;min-height:280px;display:flex;flex-direction:column;gap:25px;justify-content:space-between}
        @media(max-width:1023px){.it-reduced .it-static-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.it-reduced .it-static-card{min-height:230px}}
      `}</style>
    </section>
  );
};
