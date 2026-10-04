import { useEffect, useRef, useState } from "react";
import { FileText, Mic2, Award, Hammer, Rocket } from "lucide-react";


const steps = [
  {
    num: "01",
    icon: FileText,
    phase: "Phase 01",
    title: "Idea Submission",
    timeline: "Round 1 · Launch",
    description:
      "Submit your problem statement, early target audience, and initial hypothesis. No working code required - just clear problem articulation and conviction.",
    tags: ["Problem Statement", "Target Users", "No Code Needed"],
    highlight: false,
  },
  {
    num: "02",
    icon: Mic2,
    phase: "Phase 02",
    title: "Shortlisting & Pitch",
    timeline: "Screening Week",
    description:
      "Shortlisted candidates present a concise 3-minute pitch before an expert jury of founders and operators to defend market viability.",
    tags: ["3-Min Pitch", "Jury Q&A", "Founder Feedback"],
    highlight: false,
  },
  {
    num: "03",
    icon: Award,
    phase: "Phase 03",
    title: "The Top 10",
    timeline: "Cohort Selection",
    description:
      "The top 10 most promising ventures are chosen to enter the flagship IGNITE Incubation cohort with dedicated mentorship slots.",
    tags: ["Cohort Announcement", "Mentor Matching", "Seed Access"],
    highlight: false,
  },
  {
    num: "04",
    icon: Hammer,
    phase: "Phase 04",
    title: "The 20 Weeks",
    timeline: "Incubation & Acceleration",
    description:
      "20 weeks of intensive execution: sprint reviews, no-code MVP development (Airtable/Webflow/Bubble), customer interviews, and ecosystem visits.",
    tags: ["Weekly Sprints", "MVP Shipping", "VC Check-ins"],
    highlight: true,
  },
  {
    num: "05",
    icon: Rocket,
    phase: "Phase 05",
    title: "Final Pitch / Demo Day",
    timeline: "Grand Finale",
    description:
      "Present working traction, active users, and company milestones before institutional venture funds, angels, and industry leaders to win from the ₹1,00,000 grant pool.",
    tags: ["₹1,00,000 Grant", "Live Demo", "Angel Investment"],
    highlight: true,
  },
];

const GREEN = "#5C8C3A";
const ROUTE_START = "#A9C78F"; // lighter green
const ROUTE_END = "#6F9F4C";

type Pt = { x: number; y: number };
type Anchor = { s: number; l: number };

export const TimelineSection = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const baseRef = useRef<SVGPathElement | null>(null);
  const drawRef = useRef<SVGPathElement | null>(null);
  const markerRef = useRef<SVGCircleElement | null>(null);
  const haloRef = useRef<SVGCircleElement | null>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [stopPts, setStopPts] = useState<Pt[]>([]);
  const [reached, setReached] = useState(0); // how many stops the marker has passed
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState<boolean[]>(() => steps.map(() => false));
  const [reduce, setReduce] = useState(false);

  // reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Staggered text reveal
  useEffect(() => {
    if (reduce || typeof IntersectionObserver === "undefined") {
      setVisible(steps.map(() => true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = itemRefs.current.indexOf(e.target as HTMLDivElement);
          if (i < 0) return;
          setVisible((v) => (v[i] ? v : v.map((x, k) => (k === i ? true : x))));
          io.unobserve(e.target);
        });
      },
      { threshold: 0.15 }
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [reduce]);

  // route geometry + scroll-linked drawing
  useEffect(() => {
    const stage = stageRef.current;
    const draw = drawRef.current;
    const base = baseRef.current;
    if (!stage || !draw || !base) return;

    let alive = true;
    let L = 1;
    let stopLens: number[] = [];
    let anchors: Anchor[] = [];
    let raf = 0;
    let lastReached = -1;
    let lastActive = -2;

    const build = () => {
      if (!alive) return;
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (!W || !H) return;
      const mobile = window.innerWidth < 1024;
      const cx = mobile ? 14 : W / 2;
      const amp = mobile ? 5 : 30;
      const pts: Pt[] = steps.map((_, i) => {
        const el = itemRefs.current[i];
        const y = el ? (listRef.current?.offsetTop || 0) + el.offsetTop + el.offsetHeight / 2 : 0;
        return { x: cx + (i % 2 ? amp : -amp), y };
      });
      // The SVG extends to the section's top boundary, where the vine sits.
      // A single gentle entry curve joins the first stop without an S-bump.
      const all: Pt[] = [
        { x: W / 2, y: -80 },
        { x: W / 2, y: (headerRef.current?.offsetHeight || 48) + 12 },
        ...(mobile ? [{ x: cx, y: (listRef.current?.offsetTop || 140) - 16 }] : []),
        ...pts,
      ];
      let d = `M${all[0].x} ${all[0].y}`;
      for (let i = 1; i < all.length; i++) {
        const a = all[i - 1];
        const b = all[i];
        const m = (a.y + b.y) / 2;
        d += ` C${a.x} ${m} ${b.x} ${m} ${b.x} ${b.y}`;
      }
      base.setAttribute("d", d);
      draw.setAttribute("d", d);
      L = draw.getTotalLength();
      draw.style.strokeDasharray = String(L);

      stopLens = pts.map((p, i) => {
        if (i === pts.length - 1) return L;
        let lo = 0;
        let hi = L;
        for (let k = 0; k < 24; k++) {
          const mid = (lo + hi) / 2;
          if (draw.getPointAtLength(mid).y < p.y) lo = mid;
          else hi = mid;
        }
        return lo;
      });
      const snapped = stopLens.map((l) => draw.getPointAtLength(l));
      setSize({ w: W, h: H });
      setStopPts(snapped.map((p) => ({ x: p.x, y: p.y })));

      const vh = window.innerHeight;
      anchors = [{ s: all[0].y - vh * 0.55, l: 0 }];
      // One continuous pass; each stop center is an exact scroll anchor.
      pts.forEach((p, i) => {
        anchors.push({ s: p.y - vh * 0.55, l: stopLens[i] });
      });
      // The final stop is also the path endpoint; the marker stays docked there.
      update();
    };

    const lenAt = (s: number) => {
      if (!anchors.length || s <= anchors[0].s) return 0;
      for (let i = 1; i < anchors.length; i++) {
        if (s <= anchors[i].s) {
          const a = anchors[i - 1];
          const b = anchors[i];
          const t = (s - a.s) / (b.s - a.s || 1);
          return a.l + (b.l - a.l) * t;
        }
      }
      return L;
    };

    const update = () => {
      if (!anchors.length) return;
      const s = -stage.getBoundingClientRect().top;
      const len = reduce ? L : lenAt(s);
      draw.style.strokeDashoffset = String(L - len);
      const p = draw.getPointAtLength(len);
      const show = !reduce && len > 1 ? "1" : "0";
      [markerRef.current, haloRef.current].forEach((c) => {
        if (!c) return;
        c.setAttribute("cx", String(p.x));
        c.setAttribute("cy", String(p.y));
        c.style.opacity = show;
      });
      let r = 0;
      let act = -1;
      let best = Infinity;
      stopLens.forEach((sl, i) => {
        if (len >= sl - 2) r = i + 1;
        const dist = Math.abs(sl - len);
        if (dist < best) {
          best = dist;
          act = i;
        }
      });
      if (best >= L / 12) act = -1;
      if (reduce) {
        r = steps.length;
        act = -1;
      }
      if (r !== lastReached) {
        lastReached = r;
        setReached(r);
      }
      if (act !== lastActive) {
        lastActive = act;
        setActive(act);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    build();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", build);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(build) : null;
    ro?.observe(stage);
    if (headerRef.current) ro?.observe(headerRef.current);
    itemRefs.current.forEach((el) => el && ro?.observe(el));
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    fonts?.ready.then(build);

    return () => {
      alive = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", build);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <section id="timeline" aria-label="IGNITE 20 Weeks Timeline" className="relative w-full pt-20 pb-28 px-5 md:px-12 lg:px-16 text-neutral-900 bg-transparent">
      <style>{`
        #timeline .tl5-stage { position:relative; width:100%; max-width:1280px; margin:0 auto; }
        #timeline .tl5-header { position:relative; width:100%; margin:0 0 96px; }
        #timeline .tl5-split-heading { display:grid; grid-template-columns:1fr 32px 1fr; align-items:center; margin:0; }
        #timeline .tl5-split-heading span:first-child { text-align:right; }
        #timeline .tl5-split-heading span:last-child { text-align:left; }
        #timeline .tl5-list { position:relative; display:flex; flex-direction:column; gap:64px; }
        #timeline .tl5-step { position:relative; width:calc(50% - 88px); background:transparent !important; border:0 !important; box-shadow:none !important; padding:0; }
        #timeline .tl5-step:nth-child(even) { margin-left:auto; }
        #timeline .tl5-step-heading { display:flex; align-items:flex-start; gap:16px; }
        #timeline .tl5-number { flex-shrink:0; font:700 28px/1.2 'Inter',sans-serif; padding-top:24px; color:#5C8C3A; }
        #timeline .tl5-meta { display:flex; flex-wrap:wrap; align-items:center; gap:6px; font:500 11px/1.5 ui-monospace,monospace; letter-spacing:.06em; text-transform:uppercase; color:#66665C; margin-bottom:6px; }
        #timeline .tl5-title { font:700 24px/1.3 'Baloo 2',sans-serif; margin:0 0 8px; }
        #timeline .tl5-description { font:400 15px/1.7 'Inter',sans-serif; color:#4C4C43; margin:0; }
        #timeline .tl5-tags { display:flex; flex-wrap:wrap; gap:8px 16px; margin:16px 0 0 48px; font:600 10px/1.5 ui-monospace,monospace; text-transform:uppercase; letter-spacing:.05em; color:#5C8C3A; }
        @media (max-width:1023px) {
          #timeline .tl5-header { margin-bottom:90px; }
          #timeline .tl5-split-heading { grid-template-columns:1fr 22px 1fr; }
          #timeline .tl5-list { padding-left:48px; gap:48px; }
          #timeline .tl5-step { width:100%; }
          #timeline .tl5-title { font-size:22px; }
          #timeline .tl5-number { font-size:24px; }
          #timeline .tl5-description { font-size:14px; }
        }
      `}</style>
      <div ref={stageRef} className="tl5-stage">
        <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
          <defs>
            <linearGradient id="tlRouteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={ROUTE_START} /><stop offset="1" stopColor={ROUTE_END} />
            </linearGradient>
          </defs>
          <path ref={baseRef} fill="none" stroke="#A9C78F" strokeWidth={3.5} strokeLinecap="round" />
          <path ref={drawRef} fill="none" stroke="url(#tlRouteGrad)" strokeWidth={3.5} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 5px rgba(111,159,76,0.4))" }} />
          {stopPts.map((p, i) => <circle key={steps[i].num} cx={p.x} cy={p.y} r={14} fill={reached > i ? "#EDF6E5" : "#FBFAF8"} stroke={active === i ? GREEN : "#A9C78F"} strokeWidth={2.5} />)}
          <circle ref={haloRef} r={20} fill="rgba(92,140,58,0.14)" style={{ opacity: 0 }} />
          <circle ref={markerRef} r={8} fill="#fff" stroke={GREEN} strokeWidth={3} style={{ opacity: 0, filter: "drop-shadow(0 0 5px rgba(92,140,58,0.65))" }} />
        </svg>
        <div ref={headerRef} className="tl5-header">
          <h2 className="tl5-split-heading font-headingNow font-medium text-[clamp(2.6rem,5.8vw,4.6rem)] leading-[1.1] tracking-[-0.035em] text-[#111a12]" aria-label="Timeline"><span>TIME</span><span aria-hidden="true" /><span>LINE</span></h2>
        </div>
        <div ref={listRef} className="tl5-list">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return <div key={step.num} ref={el => { itemRefs.current[i] = el; }} className="tl5-step" style={{ opacity: visible[i] || reduce ? 1 : 0, transition: reduce ? "none" : "opacity 650ms ease", transitionDelay: reduce ? "0ms" : `${i % 2 * 80}ms` }}>
              <div className="tl5-step-heading">
                <span className="tl5-number" aria-label={`Step ${step.num}`}>{step.num}</span>
                <div>
                  <div className="tl5-meta"><Icon size={14} aria-hidden="true" /><span>{step.phase}</span><span aria-hidden="true">·</span><span>{step.timeline}</span></div>
                  <h3 className="tl5-title" style={{ color: active === i ? GREEN : "#141412" }}>{step.title}</h3>
                  <p className="tl5-description">{step.description}</p>
                </div>
              </div>
              <div className="tl5-tags">{step.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
};
