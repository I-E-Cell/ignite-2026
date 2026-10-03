import { useEffect, useRef, useState } from "react";
import { FileText, Mic2, Award, Hammer, Rocket } from "lucide-react";

const HEADER_SUBTEXT =
  "A clear, deliberate progression from back-of-the-napkin spark to an operational, funded student startup.";

const steps = [
  {
    num: "01",
    icon: FileText,
    phase: "Phase 01",
    title: "Idea Submission",
    timeline: "Round 1 · Launch",
    description:
      "Submit your problem statement, early target audience, and initial hypothesis. No working code required—just clear problem articulation and conviction.",
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

  // staggered card reveal
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

    let L = 1;
    let stopLens: number[] = [];
    let anchors: Anchor[] = [];
    let raf = 0;
    let lastReached = -1;
    let lastActive = -2;

    const build = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (!W || !H) return;
      const mobile = window.innerWidth < 1024;
      const cx = mobile ? 14 : W / 2;
      const amp = mobile ? 5 : 30;
      const pts: Pt[] = steps.map((_, i) => {
        const el = itemRefs.current[i];
        const y = el ? el.offsetTop + el.offsetHeight / 2 : 0;
        return { x: cx + (i % 2 ? amp : -amp), y };
      });
      const all: Pt[] = [
        { x: cx, y: Math.max(0, pts[0].y - 90) },
        ...pts,
        { x: cx, y: Math.min(H, pts[pts.length - 1].y + 90) },
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

      stopLens = pts.map((p) => {
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
      anchors = [{ s: pts[0].y - vh * 0.55 - 140, l: 0 }];
      pts.forEach((p, i) => anchors.push({ s: p.y - vh * 0.55, l: stopLens[i] }));
      anchors.push({ s: pts[pts.length - 1].y - vh * 0.55 + 160, l: L });
      update();
    };

    const lenAt = (s: number) => {
      if (!anchors.length || s <= anchors[0].s) return 0;
      for (let i = 1; i < anchors.length; i++) {
        if (s <= anchors[i].s) {
          const a = anchors[i - 1];
          const b = anchors[i];
          let t = (s - a.s) / (b.s - a.s || 1);
          t = (t * t * (3 - 2 * t)) * 0.35 + t * 0.65;
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
    itemRefs.current.forEach((el) => el && ro?.observe(el));
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    fonts?.ready.then(build);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", build);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <section
      id="timeline"
      aria-label="IGNITE 20 Weeks Timeline"
      className="relative w-full pt-20 pb-28 px-5 md:px-12 lg:px-16 text-neutral-900 bg-transparent"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center mb-16">
          <span
            className="block text-center mb-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "1.3px",
              color: "#A8A69B",
            }}
          >
            (Timeline)
          </span>
          <h2
            className="tracking-tight leading-[1.2] text-[#141412]"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 4vw, 38.4px)",
            }}
          >
            How the 20 weeks actually happen.
          </h2>
          <p
            className="mt-3 text-base md:text-lg text-stone-600 max-w-xl leading-relaxed"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            {HEADER_SUBTEXT}
          </p>
        </div>

        {/* Route + cards */}
        <div ref={stageRef} className="w-full relative">
          <svg
            className="absolute left-0 top-0 pointer-events-none overflow-visible"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="tlRouteGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={ROUTE_START} />
                <stop offset="1" stopColor={ROUTE_END} />
              </linearGradient>
            </defs>
            <path
              ref={baseRef}
              fill="none"
              stroke="rgba(20,20,18,0.14)"
              strokeWidth={2}
              strokeDasharray="3 9"
              strokeLinecap="round"
            />
            <path
              ref={drawRef}
              fill="none"
              stroke="url(#tlRouteGrad)"
              strokeWidth={3.5}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 5px rgba(111,159,76,0.55))" }}
            />
            <circle
              ref={haloRef}
              r={16}
              fill="rgba(92,140,58,0.25)"
              style={{ opacity: 0 }}
            />
            <circle
              ref={markerRef}
              r={8}
              fill="#fff"
              stroke={GREEN}
              strokeWidth={3}
              style={{ opacity: 0, filter: "drop-shadow(0 0 8px rgba(92,140,58,0.9))" }}
            />
          </svg>

          {/* Stop dots on the route */}
          {stopPts.map((p, i) => {
            const isActive = active === i;
            const isReached = reached > i;
            return (
              <div
                key={steps[i].num}
                aria-hidden="true"
                className={`absolute z-10 h-5 w-5 -ml-2.5 -mt-2.5 rounded-full border-2 transition-all duration-300 motion-reduce:transition-none ${isActive
                    ? "bg-[#5C8C3A] border-[#5C8C3A] scale-125 shadow-[0_0_0_6px_rgba(92,140,58,0.25)]"
                    : isReached
                      ? "bg-[#8FB06F] border-[#8FB06F]"
                      : "bg-white border-[#BFD3AD]"
                  }`}
                style={{ left: p.x, top: p.y, width: 20, height: 20, borderRadius: "9999px" }}
              />
            );
          })}

          <div className="w-full relative flex flex-col gap-6 lg:gap-10 pl-9 lg:pl-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = active === i;
              return (
                <div
                  key={step.num}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  style={{ transitionDelay: visible[i] && !reduce ? `${(i % 2) * 80}ms` : "0ms" }}
                  className={`relative w-full lg:w-[calc(50%-88px)] ${i % 2 === 0 ? "lg:mr-auto" : "lg:ml-auto"} rounded-2xl p-5 sm:p-6 border transition-all duration-700 ease-out motion-reduce:transition-none hover:-translate-y-1 hover:shadow-xl ${visible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    } ${step.highlight
                      ? "bg-gradient-to-r from-white/95 to-[#EDF6E5]/90 border-[#5C8C3A]/45 shadow-md"
                      : "bg-white/80 border-stone-200/90 shadow-xs backdrop-blur-xs hover:border-[#5C8C3A]/50"
                    } ${isActive ? "ring-2 ring-[#5C8C3A]/60 shadow-xl" : ""}`}
                >
                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Step Number Tag */}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl flex flex-col items-center justify-center transition-colors duration-300 ${isActive ? "bg-[#5C8C3A]" : "bg-[#141412]"
                          }`}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: "11px",
                            textTransform: "uppercase",
                            color: "#A8A69B",
                          }}
                        >
                          Step
                        </span>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: "18px",
                            color: "#FBFAF8",
                          }}
                        >
                          {step.num}
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2 text-xs font-geist_mono uppercase tracking-wider text-stone-500">
                          <Icon size={14} aria-hidden="true" />
                          <span>{step.phase}</span>
                          <span aria-hidden="true">·</span>
                          <span>{step.timeline}</span>
                        </div>
                        <h3
                          className="text-[#141412]"
                          style={{
                            fontFamily: "'Baloo 2', sans-serif",
                            fontWeight: 700,
                            fontSize: "22px",
                            lineHeight: "32px",
                            letterSpacing: "0.48px",
                          }}
                        >
                          {step.title}
                        </h3>
                        <p
                          className="text-sm text-stone-600 max-w-xl leading-relaxed"
                          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-start gap-2 flex-wrap">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold font-geist_mono uppercase tracking-wide border transition-colors duration-300 ${isActive
                              ? "bg-[#141412] text-white border-[#141412]"
                              : "bg-white/70 text-stone-700 border-stone-300"
                            }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
