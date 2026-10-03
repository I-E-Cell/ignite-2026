
import { useEffect, useMemo, useRef, useState } from "react";

type GalleryCategory = "all" | "pitches" | "mentors" | "top10" | "demoday" | "alumni";
interface GalleryItem { id: string; category: GalleryCategory; title: string; subtitle: string; image: string; badge: string }

const BASE = "https://www.recursiveacm.in/images/ui/";
const ITEMS: GalleryItem[] = [
  { id: "g1", category: "pitches", title: "Round 1 Pitches", subtitle: "Student founders pitching initial problem validation before the screening panel.", image: BASE + "doodle_ideas_impact.png", badge: "Round 1" },
  { id: "g2", category: "mentors", title: "Mentor & VC Sessions", subtitle: "1-on-1 strategy sessions deconstructing customer acquisition and no-code workflows.", image: BASE + "polaroid_victoria.png", badge: "Mentorship" },
  { id: "g3", category: "top10", title: "Top 10 Reveal", subtitle: "Celebration of the 10 finalist teams selected for the intensive 20-week accelerator.", image: BASE + "polaroid_howrah.png", badge: "Incubation" },
  { id: "g4", category: "demoday", title: "Demo Day & Grant Awards", subtitle: "Finalists presenting live product traction on stage to secure \u20B91,00,000 seed checks.", image: BASE + "doodle_building_tomorrow.png", badge: "Demo Day" },
  { id: "g5", category: "alumni", title: "Alumni Startups", subtitle: "Past student teams who launched products on campus and reached active paying customers.", image: BASE + "artifact.png", badge: "Success Stories" },
];
const TABS: { key: GalleryCategory; label: string }[] = [
  { key: "all", label: "All Highlights" }, { key: "pitches", label: "Round 1 Pitches" }, { key: "mentors", label: "Mentor Sessions" },
  { key: "top10", label: "Top 10 Reveal" }, { key: "demoday", label: "Demo Day" }, { key: "alumni", label: "Alumni Startups" },
];
const ASPECTS = [1, 0.8, 1.25, 0.9, 1.1, 0.85, 1.2, 1];
const ROWS = 4;
const PER_ROW = 8;
const ROWS_MOBILE = 3;
const PER_ROW_MOBILE = 6;

export function GallerySection() {
  const [filter, setFilter] = useState<GalleryCategory>("all");
  const [mobile, setMobile] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const st = useRef({ t: 0, hover: false, speed: 1, visible: true, drag: 0, lastX: 0, startX: 0, down: false, moved: false });
  const [openKey, setOpenKey] = useState<string | null>(null);

  const openKeyRef = useRef<string | null>(null);
  openKeyRef.current = openKey;
  const tileH = mobile ? 104 : 190;
  const gap = mobile ? 12 : 22;

  const rows = useMemo(() => {
    const base = filter === "all" ? ITEMS : ITEMS.filter((i) => i.category === filter);
    const nRows = mobile ? ROWS_MOBILE : ROWS;
    const nCols = mobile ? PER_ROW_MOBILE : PER_ROW;
    return Array.from({ length: nRows }, (_, r) =>
      Array.from({ length: nCols }, (_, i) => ({ item: base[(i + r * 2) % base.length], aspect: ASPECTS[(i + r * 3) % ASPECTS.length] }))
    );
  }, [filter, mobile]);
  const rowWidth = (row: { aspect: number }[]) => row.reduce((w, c) => w + c.aspect * tileH + gap, 0);

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // slow drift + scroll-linked movement; rows travel in alternating directions
  useEffect(() => {
    const s = st.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, last = performance.now();
    const stageEl = stageRef.current;
    const io = stageEl ? new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; }, { rootMargin: "100px" }) : null;
    if (stageEl && io) io.observe(stageEl);
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!s.visible) { raf = requestAnimationFrame(tick); return; } // paused while off-screen
      s.speed += ((s.hover || reduced || openKeyRef.current ? 0 : 1) - s.speed) * Math.min(1, dt * 2);
      s.t += dt * s.speed;
      const stage = stageRef.current;
      let prog = 0;
      if (stage) {
        const r = stage.getBoundingClientRect();
        prog = (window.innerHeight - r.top) / (window.innerHeight + r.height); // 0..1 while on screen
      }
      rows.forEach((row, ri) => {
        const el = rowRefs.current[ri];
        if (!el) return;
        const W = rowWidth(row);
        const dir = ri % 2 === 0 ? -1 : 1;
        const raw = s.t * (90 + ri * 18) + prog * W * 0.9 + ri * 120 + s.drag * dir;
        const off = ((raw % W) + W) % W;
        el.style.transform = `translate3d(${dir === -1 ? -off : off - W}px,0,0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }, [rows, tileH, gap]);

  return (
    <section id="gallery" aria-label="IGNITE Gallery & Past Moments" className="relative w-full pt-16 pb-28 px-5 md:px-12 lg:px-16 text-neutral-900 bg-transparent overflow-hidden">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13, lineHeight: "16px", letterSpacing: "1.3px", textTransform: "uppercase", color: "#9A9A90" }}>(Gallery)</span>
        <h2 className="tracking-tight leading-[1.1] text-[#141412] mt-3 text-center" style={{ fontFamily: 'var(--font-headingNow), "Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "clamp(2.2rem,4.5vw,44px)" }}>Program Moments &amp; Highlights</h2>
        <p className="mt-3 text-base md:text-lg text-stone-600 leading-relaxed text-center mb-8" style={{ fontFamily: "Inter, sans-serif" }}>From preliminary pitches to demo day checks&mdash;glimpses of the venture builder journey.</p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {TABS.map((t) => {
            const on = filter === t.key;
            return (
              <button key={t.key} onClick={() => setFilter(t.key)}
                style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13, lineHeight: "18px", borderRadius: 4, padding: "8px 18px", transition: "all 180ms", cursor: "pointer",
                  background: on ? "#141412" : "#FBFAF8", color: on ? "#FBFAF8" : "#141412", border: on ? "1px solid #141412" : "1px solid #D6D4CB"
                }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* dark stage with the tilted photo roll */}
        <div ref={stageRef}
          className="relative w-full touch-pan-y overflow-hidden h-[380px] sm:h-[640px]"
          onPointerDown={(e) => { const s = st.current; s.down = true; s.moved = false; s.lastX = s.startX = e.clientX; }}
          onPointerMove={(e) => {
            const s = st.current;
            if (!s.down) return;
            if (!s.moved && Math.abs(e.clientX - s.startX) > 6) { s.moved = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }
            if (!s.moved) return;
            s.drag += e.clientX - s.lastX; s.lastX = e.clientX;
          }}
          onPointerUp={() => { st.current.down = false; }} onPointerCancel={() => { st.current.down = false; }}
          onMouseEnter={() => (st.current.hover = true)} onMouseLeave={() => (st.current.hover = false)}
          style={{ perspective: 1400, maskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent), linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)", maskComposite: "intersect", WebkitMaskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent), linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)", WebkitMaskComposite: "source-in" }}>
          <div className="absolute left-1/2 top-1/2 flex flex-col"
            style={{ width: "200%", gap, transform: "translate(-50%,-50%) rotateX(38deg) rotateZ(-14deg) scale(1.05)", transformStyle: "preserve-3d" }}>
            {rows.map((row, ri) => (
              <div key={`${filter}-${ri}`} className="relative" style={{ height: tileH }}>
                <div ref={(el) => { rowRefs.current[ri] = el; }} className="absolute left-0 top-0 flex will-change-transform" style={{ gap, height: tileH }}>
                  {(mobile ? [...row, ...row] : [...row, ...row, ...row]).map((c, i) => {
                    const key = `${ri}-${i}`;
                    const open = openKey === key;
                    return (
                      <figure key={i} onClick={() => { if (!st.current.moved) setOpenKey(open ? null : key); }} className="group relative m-0 shrink-0 cursor-pointer overflow-hidden bg-[#FBFAF8] shadow-[0_14px_30px_-10px_rgba(20,20,18,0.35)] ring-1 ring-black/5"
                        style={{ height: tileH, width: c.aspect * tileH, border: `${mobile ? 4 : 6}px solid #FBFAF8`, borderRadius: 4, transform: `rotate(${((i % 5) - 2) * 0.8}deg)` }}>
                        <img src={c.item.image} alt={c.item.title} draggable={false} loading="lazy" decoding="async" className="h-full w-full object-contain bg-[#FBFAF8]" />
                        <figcaption className={`absolute inset-x-0 bottom-0 bg-[#141412]/85 px-2 py-1.5 transition-transform duration-300 group-hover:translate-y-0 ${open ? "translate-y-0" : "translate-y-full"}`}>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-[#A9C78F]" style={{ fontFamily: "Inter, sans-serif" }}>{c.item.badge}</span>
                          <span className="block text-xs text-white" style={{ fontFamily: 'var(--font-headingNow), "Plus Jakarta Sans", sans-serif', fontWeight: 700 }}>{c.item.title}</span>
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
