import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useReducedMotion } from "motion/react";

const benefits = [
  {
    "id": "grant",
    "title": "₹1,00,000 Seed Grant",
    "badge": "Non-Dilutive Capital",
    "description": "Milestone-based equity-free seed grant to convert your prototype into a production venture."
  },
  {
    "id": "mentorship",
    "title": "Founder & VC Sessions",
    "badge": "1-on-1 Office Hours",
    "description": "Weekly direct office hours with venture capitalists, funded alumni operators, and seasoned mentors."
  },
  {
    "id": "visits",
    "title": "Ecosystem & Tech Visits",
    "badge": "Venture Immersion",
    "description": "Curated delegation visits to premier startup incubators, tech parks, and regional VC offices."
  },
  {
    "id": "registration",
    "title": "Startup Registration",
    "badge": "Legal & Entity Support",
    "description": "End-to-end guidance on company incorporation (Pvt Ltd), DPIIT recognition, trademarking, and IP."
  },
  {
    "id": "demo-day",
    "title": "Final Pitch / Demo Day",
    "badge": "The Grand Stage",
    "description": "Pitch live on stage in front of active angel syndicates, venture capitalists, corporate partners, and press."
  },
  {
    "id": "support",
    "title": "Program Support & Credits",
    "badge": "20-Week Backbone",
    "description": "Hands-on venture management, dedicated maker lab access, cloud credits, and no-code tool stacks."
  }
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

export const PerksSection = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const { progress, pinY } = useScene(sceneRef, reduced);
  const headingOpacity = useTransform(progress, [0, 0.18, 0.38], [1, 1, 0]);
  const headingY = useTransform(progress, [0, 0.38], [0, -35]);
  const firstY = useTransform(progress, [0.22, 0.72], [0, -90]);
  const lastY = useTransform(progress, [0.22, 0.72], [90, 0]);
  const firstOpacity = useTransform(progress, [0.22, 0.46], [1, 0]);
  const lastOpacity = useTransform(progress, [0.4, 0.68], [0, 1]);
  return <section id="perks" className={`ignite-perks ${reduced ? "ip-reduced" : ""}`} aria-label="What you get in IGNITE">
    <div ref={sceneRef} className="ip-scroll">
      <motion.div className="ip-stage" style={reduced ? {} : { y: pinY }}>
        <motion.header className="ip-heading" style={reduced ? {} : { opacity: headingOpacity, y: headingY }}>
          <span className="ip-label">THE BACKBONE OF YOUR NEXT BIG THING</span>
          <h2>We back the builders.</h2>
        </motion.header>
        <div className="ip-rows">
          {[[0, 1, 2], [3, 4, 5]].map((indices, group) => <motion.div className={`ip-row ip-row-${group}`} key={group} style={reduced ? {} : { y: group === 0 ? firstY : lastY, opacity: group === 0 ? firstOpacity : lastOpacity }}>
            <div className="ip-grid">{indices.map(i => <article key={benefits[i].id} className="ip-benefit">
              <span className="ip-number">0{i + 1} /</span><span className="ip-label">{benefits[i].badge}</span>
              <h3>{benefits[i].title}</h3><p>{benefits[i].description}</p>
            </article>)}</div>
          </motion.div>)}
        </div>
      </motion.div>
    </div>
    <style>{`
      .ignite-perks{position:relative;background:#000;color:#eff4e8;font-family:'Inter',sans-serif;isolation:isolate}
      .ignite-perks *{box-sizing:border-box}
      .ip-scroll{position:relative;height:230svh}
      .ip-stage{position:relative;height:100svh;min-height:660px;overflow:hidden;background:#000}
      .ip-heading{position:absolute;top:15%;left:50%;width:min(1140px,90%);margin-left:calc(min(1140px,90%) / -2);z-index:2}
      .ip-label{display:block;font:10px 'Geist Mono',monospace;letter-spacing:.19em;line-height:1.6;color:#9dbc81;text-transform:uppercase}
      .ip-heading h2{font-family:var(--font-headingNow),'Plus Jakarta Sans',sans-serif;font-size:clamp(32px,4.1vw,54px);font-weight:500;letter-spacing:-.045em;line-height:1.12;margin:18px 0 0}
      .ip-rows{position:absolute;inset:0}
      .ip-row{position:absolute;inset:0;height:100%;display:flex;align-items:center;justify-content:center;padding:150px 0 40px}
      .ip-row-1{padding-top:60px}
      .ip-grid{width:min(1140px,90%);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:52px}
      .ip-benefit{padding-top:20px;border-top:1px solid #94ad7438}
      .ip-number{display:block;font:12px 'Geist Mono',monospace;color:#c5e6a5;margin-bottom:28px}
      .ip-benefit h3{font-family:var(--font-headingNow),'Plus Jakarta Sans',sans-serif;font-size:clamp(25px,2.5vw,34px);font-weight:500;letter-spacing:-.035em;line-height:1.12;margin:14px 0 18px;min-height:76px}
      .ip-benefit p{font-size:14px;line-height:1.8;color:#a8b5a0;margin:0}
      @media(max-width:767px){.ip-stage{min-height:780px}.ip-heading{top:10%;width:calc(100% - 48px);margin-left:calc((100% - 48px) / -2)}.ip-heading h2{font-size:30px;margin-top:14px}.ip-label{font-size:8px}.ip-grid{width:calc(100% - 48px);grid-template-columns:1fr;gap:28px}.ip-row{padding:160px 0 30px}.ip-row-1{padding:65px 0 45px}.ip-number{margin-bottom:12px}.ip-benefit{padding-top:13px}.ip-benefit h3{font-size:25px;min-height:0;margin:8px 0 12px}.ip-benefit p{font-size:12px;line-height:1.65}}
      .ip-reduced .ip-scroll{height:auto}.ip-reduced .ip-stage{height:auto;min-height:0;transform:none!important;padding:75px 0 50px}.ip-reduced .ip-heading{position:relative;top:auto;left:auto;margin:0 auto 45px;opacity:1!important;transform:none!important}.ip-reduced .ip-rows{position:relative;height:auto;transform:none!important}.ip-reduced .ip-row{position:relative;height:auto;padding:0 0 45px;transform:none!important;opacity:1!important}
      @media(prefers-reduced-motion:reduce){.ip-scroll{height:auto}.ip-stage{height:auto;min-height:0;transform:none!important;padding:75px 0 50px}.ip-heading{position:relative;top:auto;left:auto;margin:0 auto 45px;opacity:1!important;transform:none!important}.ip-rows{position:relative;height:auto;transform:none!important}.ip-row{position:relative;height:auto;padding:0 0 45px;transform:none!important;opacity:1!important}}
    `}</style>
  </section>;
};
