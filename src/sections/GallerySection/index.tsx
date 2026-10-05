
import { useEffect, useMemo, useRef, useState } from "react";

type GalleryCategory = "all" | "pitches" | "mentors" | "top10" | "demoday" | "alumni";
interface GalleryItem {
  id: string;
  category: GalleryCategory | GalleryCategory[];
  title: string;
  subtitle: string;
  image: string;
  badge: string;
}

const BASE = "/images/gallery/";
const ITEMS: GalleryItem[] = [
  {
    id: "g1",
    category: "pitches",
    title: "Formal Jury Evaluation",
    subtitle: "Student founder squads defending problem validation and venture viability before judges.",
    image: BASE + "pitch-jury-evaluation.jpeg",
    badge: "Round 1 Pitch",
  },
  {
    id: "g2",
    category: "mentors",
    title: "Roundtable Mentor Circle",
    subtitle: "Deep-dive problem scoping and unit economics pressure-testing with seasoned operators.",
    image: BASE + "mentor-brainstorm-circle.jpeg",
    badge: "Mentorship",
  },
  {
    id: "g3",
    category: "pitches",
    title: "Live Classroom Pitch",
    subtitle: "Teams presenting technical architecture and customer traction on the main display.",
    image: BASE + "pitch-classroom-presentation.jpeg",
    badge: "Presentation",
  },
  {
    id: "g4",
    category: "mentors",
    title: "1-on-1 Founder Mentoring",
    subtitle: "Focused strategy discussions breaking down product-market fit and customer acquisition.",
    image: BASE + "mentor-feedback-session.jpeg",
    badge: "1-on-1 Guidance",
  },
  {
    id: "g5",
    category: ["top10", "demoday"],
    title: "Top 10 Cohort Felicitation",
    subtitle: "Recognizing outstanding finalists entering the flagship 20-week incubation accelerator.",
    image: BASE + "awards-trophy-handover.jpeg",
    badge: "Top 10 Reveal",
  },
  {
    id: "g6",
    category: ["demoday", "top10"],
    title: "Grand Stage Awards",
    subtitle: "Presenting awards and mementos on stage before faculty, guests, and investor judges.",
    image: BASE + "awards-ceremony-stage.jpeg",
    badge: "Grant Awards",
  },
  {
    id: "g7",
    category: "mentors",
    title: "Auditorium Strategy Huddle",
    subtitle: "Breakout advisory discussions in the auditorium tackling business model mechanics.",
    image: BASE + "mentor-auditorium-review.jpeg",
    badge: "Strategy Huddle",
  },
  {
    id: "g8",
    category: ["pitches", "demoday"],
    title: "Auditorium Mainstage Showcase",
    subtitle: "High-stakes presentation on the main stage before peers and panel evaluators.",
    image: BASE + "stage-auditorium-pitch.jpeg",
    badge: "Mainstage Pitch",
  },
  {
    id: "g9",
    category: ["mentors", "alumni"],
    title: "Ecosystem Networking Hall",
    subtitle: "Founders, alumni operators, and faculty mentors connecting in the networking arena.",
    image: BASE + "networking-arena-hall.jpeg",
    badge: "Networking",
  },
  {
    id: "g10",
    category: "pitches",
    title: "Founder Delegate Check-In",
    subtitle: "Student teams arriving on campus and checking in at the registration desk.",
    image: BASE + "registration-checkin-desk.jpeg",
    badge: "Check-In",
  },
  {
    id: "g11",
    category: ["demoday", "pitches"],
    title: "Kit & Pass Distribution",
    subtitle: "Welcoming participants with delegate kits, ID badges, and summit materials.",
    image: BASE + "registration-badge-distribution.jpeg",
    badge: "Delegate Hub",
  },
  {
    id: "g12",
    category: ["top10", "alumni"],
    title: "Chapters Flagship Arena",
    subtitle: "The official AIT Pune Chapters arena setting up the student entrepreneurship ecosystem.",
    image: BASE + "chapters-networking-arena.jpeg",
    badge: "Ecosystem Hub",
  },
  {
    id: "g13",
    category: "alumni",
    title: "I&E Cell AIT Pune Legacy",
    subtitle: "The Innovation & Entrepreneurship Cell — empowering campus ventures to build and scale.",
    image: BASE + "ecell-campus-crest.jpeg",
    badge: "I&E Cell Legacy",
  },
];
const TABS: { key: GalleryCategory; label: string }[] = [
  { key: "all", label: "All Highlights" }, { key: "pitches", label: "Round 1 Pitches" }, { key: "mentors", label: "Mentor Sessions" },
  { key: "top10", label: "Top 10 Reveal" }, { key: "demoday", label: "Demo Day" }, { key: "alumni", label: "Alumni Startups" },
];
const ASPECTS = [1, 0.8, 1.25, 0.9, 1.1, 0.85, 1.2, 1];
const ROWS = 4;
const ROWS_MOBILE = 3;

// Explicit non-overlapping row partitions for "all" mode so every row has completely distinct photos
const DESKTOP_ROW_IDS: string[][] = [
  ["g1", "g8", "g3", "g10"], // Row 0: Pitch sessions & founder presentations
  ["g2", "g4", "g7"],         // Row 1: Mentor circles & 1-on-1 strategy
  ["g5", "g6", "g11"],        // Row 2: Finalists, trophy awards & delegate hub
  ["g9", "g12", "g13"],       // Row 3: Networking arena, chapters & E-Cell legacy
];

const MOBILE_ROW_IDS: string[][] = [
  ["g1", "g8", "g3", "g10"],          // Row 0: Pitches
  ["g2", "g4", "g7", "g9"],           // Row 1: Mentors & Networking
  ["g5", "g6", "g11", "g12", "g13"],  // Row 2: Awards & Ecosystem
];

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
    const itemMap = new Map(ITEMS.map((item) => [item.id, item]));
    const nRows = mobile ? ROWS_MOBILE : ROWS;
    const targetCards = mobile ? 8 : 10;

    let rowItemSets: GalleryItem[][];

    if (filter === "all") {
      const groups = mobile ? MOBILE_ROW_IDS : DESKTOP_ROW_IDS;
      rowItemSets = groups.map((ids) =>
        ids.map((id) => itemMap.get(id)).filter((item): item is GalleryItem => Boolean(item))
      );
    } else {
      const filtered = ITEMS.filter((i) =>
        Array.isArray(i.category) ? i.category.includes(filter) : i.category === filter
      );
      rowItemSets = Array.from({ length: nRows }, () => [] as GalleryItem[]);
      if (filtered.length <= nRows) {
        filtered.forEach((item, idx) => {
          rowItemSets[idx].push(item);
        });
        rowItemSets.forEach((set, r) => {
          if (set.length === 0) {
            set.push(filtered[r % filtered.length]);
          }
        });
      } else {
        filtered.forEach((item, idx) => {
          rowItemSets[idx % nRows].push(item);
        });
      }
    }

    return rowItemSets.map((rowItems, r) => {
      const k = Math.max(1, rowItems.length);
      const reps = Math.max(2, Math.ceil(targetCards / k));
      const totalCount = reps * k;

      return Array.from({ length: totalCount }, (_, i) => ({
        item: rowItems[i % k],
        aspect: ASPECTS[(i + r * 3) % ASPECTS.length],
      }));
    });
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
                        <img src={c.item.image} alt={c.item.title} draggable={false} loading="lazy" decoding="async" className="h-full w-full object-cover bg-[#FBFAF8]" />
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
