import { createPortal } from "react-dom";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";

const tracks = [{ "id": "ai", "num": "01", "name": "AI & Intelligent Systems" }, { "id": "fintech", "num": "02", "name": "FinTech & Digital Innovation" }, { "id": "healthtech", "num": "03", "name": "HealthTech & Wellness" }, { "id": "cybersecurity", "num": "04", "name": "Cybersecurity & Digital Trust" }, { "id": "web3", "num": "05", "name": "Web3 & Blockchain" }, { "id": "open", "num": "06", "name": "Open Innovation" }];

function useSceneReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Put the pinned stage directly under body so clipping/transformed app
// wrappers cannot turn it into a scrolling element. Scroll drives content only.
function useScene(ref: React.RefObject<HTMLDivElement | null>, reduced: boolean, className: string) {
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, { stiffness: 110, damping: 27, mass: 0.65, restDelta: 0.0001, restSpeed: 0.001 });
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (reduced) { rawProgress.set(0); progress.jump(0); setHost(null); return; }
    const element = ref.current;
    if (!element) return;
    const node = document.createElement("div");
    node.className = className;
    Object.assign(node.style, { position: "fixed", zIndex: "3", pointerEvents: "none", margin: "0", overflow: "hidden" });
    document.body.appendChild(node);
    let frame = 0;
    let previous = "";
    const update = () => {
      const rect = element.getBoundingClientRect();
      const height = element.firstElementChild?.getBoundingClientRect().height ?? window.innerHeight;
      const distance = Math.max(1, rect.height - height);
      const top = rect.top > 0 ? rect.top : rect.bottom < height ? rect.bottom - height : 0;
      const key = `${top}:${rect.left}:${rect.width}:${height}`;
      if (key !== previous) {
        Object.assign(node.style, { top: `${top}px`, left: `${rect.left}px`, width: `${rect.width}px`, height: `${height}px`, visibility: top >= window.innerHeight || top + height <= 0 ? "hidden" : "visible" });
        previous = key;
      }
      rawProgress.set(Math.max(0, Math.min(1, -rect.top / distance)));
    };
    update();
    setHost(node);
    const tick = () => { update(); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      node.remove();
    };
  }, [ref, reduced, className, rawProgress, progress]);
  return { progress, host };
}
function ScenePortal({ host, children }: { host: HTMLDivElement | null; children: React.ReactNode }) {
  return host ? createPortal(children, host) : <>{children}</>;
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
          <span className="it-piece-label">FIND YOUR DIRECTION</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const TracksSection = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useSceneReducedMotion();
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 600);
  useEffect(() => {
    const mq = window.matchMedia("(max-width:599px)");
    const update = () => setMobile(mq.matches);
    update(); mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const { progress: scrollYProgress, host } = useScene(stageRef, !!reduceMotion, "ignite-tracks");
  const frontOpacity = useTransform(scrollYProgress, [0.08, 0.2], [1, 0]);
  const instructionOpacity = useTransform(scrollYProgress, [0.52, 0.65], [0, 1]);

  return (
    <section id="themes" className={`ignite-tracks ${reduceMotion ? "it-reduced" : ""}`} aria-label="The six tracks">
      <div id="tracks" className="it-anchor" />
      <div className="it-scroll" ref={stageRef}>
        {host && <div aria-hidden="true" style={{ height: "100svh" }} />}
        <ScenePortal host={host}><motion.div className="it-sticky">
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
          <motion.p className="it-instruction" style={{ opacity: instructionOpacity }}>Five pieces. Six tracks. Find your direction.</motion.p>
          <div className="it-static-grid">
            {groups.map((group, i) => <div key={i} className={`it-static-card ${i % 2 === 0 ? "it-light" : "it-dark"}`} style={{ background: colors[i] }}>
              <span className="it-piece-label">IGNITE / 2026</span>
              {group.map(idx => <div key={idx} className="it-pick"><span className="it-track-num">{tracks[idx].num} ↗</span><span className="it-track-name">{tracks[idx].name}</span></div>)}
            </div>)}
          </div>
        </motion.div></ScenePortal>
      </div>
      <style>{`
        .ignite-tracks{position:relative;background:#000;color:#eef4e6;font-family:'Inter',sans-serif;isolation:isolate;scroll-margin-top:80px}
        .ignite-tracks *{box-sizing:border-box}
        .it-anchor{position:absolute;top:0;scroll-margin-top:80px}
        .it-scroll{height:210svh;position:relative}
        .it-sticky{position:relative;pointer-events:auto;height:100svh;min-height:0;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:70px 50px 30px;overflow:hidden}
        .it-heading{text-align:center;max-width:640px;position:relative;z-index:1}
        .it-eyebrow{font:10px 'Geist Mono',monospace;letter-spacing:.22em;color:#9dbc81;text-transform:uppercase}
        .it-heading h2{font-family:var(--font-headingNow),'Plus Jakarta Sans',sans-serif;font-size:clamp(42px,4.8vw,68px);font-weight:500;line-height:1.04;letter-spacing:-.05em;margin:20px 0}
        .it-heading h2 span{color:#c5e6a5}
        .it-heading p{color:#a8b5a0;font-size:13px;line-height:1.7;max-width:450px;margin:0 auto}
        .it-deck{display:flex;width:min(88%,1000px);height:clamp(255px,25vw,320px);margin-top:60px;position:relative;perspective:1800px}
        .it-piece{width:20%;height:100%;perspective:1400px;flex-shrink:0}
        .it-flipper{will-change:transform;position:relative;width:100%;height:100%;transform-style:preserve-3d}
        .it-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
        .it-front{background:#000;border-top:1px solid #a6ce7e;border-bottom:1px solid #a6ce7e}
        .it-piece:first-child .it-front{border-radius:15px 0 0 15px;border-left:1px solid #a6ce7e}.it-piece:nth-child(5) .it-front{border-radius:0 15px 15px 0;border-right:1px solid #a6ce7e}
        .it-back{transform:rotateY(180deg);border:1px solid #a6ce7e;border-radius:12px;display:flex;flex-direction:column;justify-content:space-between;padding:20px 16px;box-shadow:none}
        .it-light,.it-dark{color:#e8f1df}
        .it-piece-label{font:8px 'Geist Mono',monospace;letter-spacing:.12em;opacity:.75}
        .it-piece-content{display:flex;flex-direction:column;gap:24px}
        .it-pick{text-align:left;border:0;padding:0;background:none;color:inherit;width:100%;font-family:inherit;cursor:default}
        .it-track-num{display:block;font:11px 'Geist Mono',monospace;margin-bottom:12px;opacity:.7}
        .it-track-name{display:block;font-family:var(--font-headingNow),'Plus Jakarta Sans',sans-serif;font-size:clamp(18px,1.8vw,25px);line-height:1.14;font-weight:500;letter-spacing:-.035em}
        .it-cover-copy{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;pointer-events:none;text-align:center;color:#f1f5e9}
        .it-cover-copy span{font:9px 'Geist Mono',monospace;letter-spacing:.18em}.it-cover-copy strong{font-family:var(--font-headingNow),'Plus Jakarta Sans',sans-serif;font-size:clamp(40px,5vw,64px);line-height:1.04;font-weight:500;letter-spacing:-.05em}
        .it-instruction{font:10px 'Geist Mono',monospace;color:#9dbc81;margin:45px 0 0;text-align:center}
        .it-static-grid{display:none}
        
        
        
        
        
        
        
        
        
        
        
        
        @media(max-width:1023px){.it-sticky{padding:50px 12px 20px;min-height:0}.it-heading h2{font-size:44px}.it-heading p{font-size:12px;max-width:340px;padding:0 12px}.it-deck{width:80%;height:270px;margin-top:50px}.it-back{padding:15px 8px}.it-track-name{font-size:17px;word-break:normal;overflow-wrap:anywhere}.it-piece-label{font-size:6px;letter-spacing:0}.it-track-num{font-size:9px}.it-instruction{max-width:280px;line-height:1.7}}
        @media(max-width:599px){.it-sticky{padding:65px 16px 20px;min-height:0;justify-content:flex-start}.it-heading h2{font-size:32px;margin:12px 0}.it-heading p{font-size:10px;line-height:1.5}.it-deck{width:100%;height:440px;margin-top:25px;flex:none}.it-piece{position:absolute}.it-back{padding:12px 10px;border-radius:9px}.it-track-name{font-size:17px;line-height:1.05;overflow-wrap:normal}.it-piece-content{gap:12px}.it-piece-label{font-size:6px}.it-track-num{font-size:8px;margin-bottom:5px}.it-back>.it-piece-label:last-child{display:none}.it-instruction{margin-top:0;font-size:8px}.it-cover-copy{height:80%}.it-cover-copy strong{font-size:46px}.it-cover-copy span{font-size:8px}}
        @media(prefers-reduced-motion:reduce){.it-scroll{height:auto}.it-sticky{will-change:transform;position:relative;height:auto;min-height:0;padding-top:70px}.it-deck,.it-instruction{display:none}.it-static-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;max-width:1100px;width:100%;margin:40px 0}.it-static-card{border:1px solid #a6ce7e;border-radius:12px;padding:20px 16px;min-height:280px;display:flex;flex-direction:column;gap:25px;justify-content:space-between}}
        @media(prefers-reduced-motion:reduce) and (max-width:1023px){.it-static-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.it-static-card{min-height:230px}}
        .it-reduced .it-scroll{height:auto}.it-reduced .it-sticky{will-change:transform;position:relative;height:auto;min-height:0;padding-top:70px}.it-reduced .it-deck,.it-reduced .it-instruction{display:none}.it-reduced .it-static-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;max-width:1100px;width:100%;margin:40px 0}.it-reduced .it-static-card{border:1px solid #a6ce7e;border-radius:12px;padding:20px 16px;min-height:280px;display:flex;flex-direction:column;gap:25px;justify-content:space-between}
        @media(max-width:1023px){.it-reduced .it-static-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.it-reduced .it-static-card{min-height:230px}}
      `}</style>
    </section>
  );
};
