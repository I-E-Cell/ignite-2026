import { memo, useEffect, useRef, useState } from "react";
import { UserCheck, Users2, Shuffle, Lock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

// Order = left to right in the open row
const criteria = [
  {
    icon: UserCheck,
    badge: "Academic Year",
    title: "FE / SE / TE — Any Year",
    description: "First-year (FE), second-year (SE), and third-year (TE) students from any undergraduate program are eligible to participate.",
    highlightText: "Open to all undergraduate years",
  },
  {
    icon: Users2,
    badge: "Team Formation",
    title: "Solo or Teams of 2–4",
    description: "Apply as an individual visionary or assemble a multidisciplinary crew of up to four students to execute faster.",
    highlightText: "1 to 4 members per squad",
  },
  {
    icon: Shuffle,
    badge: "Cross-Disciplinary",
    title: "Mixed Branches Welcome",
    description: "You don't need a team of only developers. Mix computer science, design, business, mechanical, or electrical backgrounds.",
    highlightText: "Diversity strengthens startups",
  },
  {
    icon: Lock,
    badge: "Focus Rule",
    title: "One Team Per Student",
    description: "Each participant can only be registered with one team to ensure full devotion, integrity, and focus to your venture.",
    highlightText: "100% commitment to 1 idea",
  },
];

type Criterion = (typeof criteria)[number];

// A light frosted surface keeps cloud detail visible without losing contrast.
// The translucent fill is also the fallback where backdrop blur is unavailable.
const glassCardStyle = {
  background: "linear-gradient(145deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.48) 55%, rgba(245,248,242,0.62) 100%)",
  border: "1.5px solid #151515",
  backdropFilter: "blur(18px) saturate(110%)",
  WebkitBackdropFilter: "blur(18px) saturate(110%)",
  boxShadow: "0 12px 26px rgba(17,26,18,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
};



const CardBody = memo(({ item }: { item: Criterion }) => {
  const Icon = item.icon;
  return (
    <div className="relative h-full w-full min-w-0 flex flex-1 flex-col justify-between text-left text-[#151515] break-words">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-black/[0.05] border border-black/10 flex items-center justify-center shrink-0 shadow-xs">
            <Icon className="w-5 h-5 text-neutral-800" strokeWidth={1.8} />
          </div>
          <span className="text-[10px] lg:text-[9.5px] font-semibold font-geist_mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/60 border border-black/15 text-neutral-700 whitespace-nowrap shadow-2xs">
            {item.badge}
          </span>
        </div>
        <h3 className="text-[19px] lg:text-[17px] leading-snug font-bold font-headingNow tracking-tight text-[#141412] mb-2">
          {item.title}
        </h3>
        <p className="text-[14px] lg:text-[12px] font-dm_sans text-[#30352F] leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="pt-3 border-t border-black/15 flex items-center gap-2 text-[11px] lg:text-[10.5px] font-semibold font-geist_mono text-[#252B24]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5C8C3A] shrink-0" />
        <span className="tracking-tight">{item.highlightText}</span>
      </div>
    </div>
  );
});

export const EligibilitySection = () => {
  const reduceMotion = useReducedMotion();
  // Mount only the layout being used. Hidden desktop cards should not animate
  // or run viewport observers on a phone.
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const pickFront = (prev: number) => {
    let n = Math.floor(Math.random() * criteria.length);
    if (n === prev) n = (n + 1 + Math.floor(Math.random() * (criteria.length - 1))) % criteria.length;
    return n;
  };
  const [front, setFront] = useState(() => Math.floor(Math.random() * criteria.length));
  const mid = (criteria.length - 1) / 2;

  const [open, setOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowWidth, setRowWidth] = useState(0);

  // Size the whole row, not just the cards, so all four fit at every
  // desktop width (including the 1024px breakpoint).
  useEffect(() => {
    if (!isDesktop || !rowRef.current) return;
    const row = rowRef.current;
    const update = () => setRowWidth(row.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => observer.disconnect();
  }, [isDesktop]);

  const cardGap = 24;
  const cardWidth = Math.min(270, Math.max(0, (rowWidth - cardGap * (criteria.length - 1)) / criteria.length));

  // Re-roll the front card whenever the stack collapses
  useEffect(() => {
    if (!open) setFront((p) => pickFront(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <section
      id="eligibility"
      aria-label="Who Can Join IGNITE"
      className="relative w-full pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-5 md:px-12 lg:px-16 text-neutral-900 bg-transparent overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center mb-8 sm:mb-12 lg:mb-16">
          <span
            className="block text-center mb-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              lineHeight: "16px",
              letterSpacing: "1.3px",
              textTransform: "uppercase",
              color: "#9A9A90",
            }}
          >
            (Who Can Join)
          </span>

          <h2
            className="tracking-tight leading-[1.1] text-[#141412]"
            style={{
              fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 7vw, 44px)",
            }}
          >
            Eligibility &amp; Team Rules
          </h2>

          <p
            className="mt-3 text-base md:text-lg text-stone-600 leading-relaxed"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            No coding credentials needed. If you have an eye for friction in everyday life and the drive to build, you are welcome here.
          </p>
        </div>

        {/* Desktop stack opens into a straight row; mobile keeps readable cards below. */}
        {isDesktop ? (
          <motion.div
            ref={rowRef}
            className="relative w-full h-[420px]"
            onViewportEnter={() => setOpen(true)}
            viewport={{ once: true, amount: 0.6 }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => {
              setOpen(false);
            }}
          >
            {criteria.map((item, i) => {
              const rel = i - mid;
              const x = open ? rel * (cardWidth + cardGap) : 0;
              return (
                <motion.div
                  key={item.title}
                  initial={false}
                  animate={{ x, y: 0, rotate: 0, scale: 1 }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 24, mass: 0.9 }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: cardWidth || "calc((100% - 72px) / 4)",
                    height: 350,
                    marginLeft: cardWidth ? -cardWidth / 2 : "calc((72px - 100%) / 8)",
                    marginTop: -175,
                    borderRadius: 24,
                    padding: cardWidth >= 240 ? 22 : 18,
                    transformOrigin: "50% 50%",
                    ...glassCardStyle,
                    backfaceVisibility: "hidden",
                    zIndex: i === front ? 10 : 9 - Math.abs(i - front),
                    cursor: "default",
                    overflow: "hidden",
                    willChange: "transform",
                    contain: "layout paint",
                  }}
                >
                  <CardBody item={item} />
                </motion.div>
              );
            })}
          </motion.div>

        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {criteria.map((item) => (
              <motion.div
                key={item.title}
                initial={reduceMotion ? false : { opacity: 0.85, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-w-0 flex-col rounded-[24px] p-5 sm:p-6 min-h-[240px]"
                style={glassCardStyle}
              >
                <CardBody item={item} />
              </motion.div>
            ))}
          </div>

        )}

        {/* Eligibility Bottom Banner */}
        <div className="mt-10 px-6 py-4 rounded-xl bg-[#5C8C3A]/10 border border-[#5C8C3A]/25 text-center max-w-xl text-xs sm:text-sm font-dm_sans text-[#1B3519]">
          <strong>Note:</strong> Teams can include members from different years and departments. Cross-functional teams are strongly encouraged.
        </div>
      </div>
    </section>
  );
};
