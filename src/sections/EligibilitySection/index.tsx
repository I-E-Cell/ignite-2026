import { memo, useEffect, useState } from "react";
import { UserCheck, Users2, Shuffle, Lock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

// Order = left to right in the fan
const criteria = [
  {
    icon: UserCheck,
    badge: "Academic Year",
    display: "FE/SE/TE",
    title: "FE / SE / TE — Any Year",
    description: "First-year (FE), second-year (SE), and third-year (TE) students from any undergraduate program are eligible to participate.",
    highlightText: "Open to all undergraduate years",
    gradient: "linear-gradient(160deg, #7FB04A 0%, #5C8C3A 50%, #2F5527 100%)",
  },
  {
    icon: Users2,
    badge: "Team Formation",
    display: "1–4",
    title: "Solo or Teams of 2–4",
    description: "Apply as an individual visionary or assemble a multidisciplinary crew of up to four students to execute faster.",
    highlightText: "1 to 4 members per squad",
    gradient: "linear-gradient(160deg, #A3B87A 0%, #758A4A 50%, #3F4D2A 100%)",
  },
  {
    icon: Shuffle,
    badge: "Cross-Disciplinary",
    display: "Mixed",
    title: "Mixed Branches Welcome",
    description: "You don't need a team of only developers. Mix computer science, design, business, mechanical, or electrical backgrounds.",
    highlightText: "Diversity strengthens startups",
    gradient: "linear-gradient(160deg, #7FB04A 0%, #5C8C3A 50%, #2F5527 100%)",
  },
  {
    icon: Lock,
    badge: "Focus Rule",
    display: "1",
    title: "One Team Per Student",
    description: "Each participant can only be registered with one team to ensure full devotion, integrity, and focus to your venture.",
    highlightText: "100% commitment to 1 idea",
    gradient: "linear-gradient(160deg, #A3B87A 0%, #758A4A 50%, #3F4D2A 100%)",
  },
];

type Criterion = (typeof criteria)[number];



const CardBody = memo(({ item }: { item: Criterion }) => {
  const Icon = item.icon;
  return (
    <div className="relative h-full w-full min-w-0 flex flex-1 flex-col justify-between gap-6 lg:gap-0 text-left text-white break-words">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Icon className="w-[18px] h-[18px]" />
          </div>
          <span className="text-[10px] lg:text-[9px] font-semibold font-geist_mono uppercase tracking-wider px-2 py-1 rounded-full bg-white/20 whitespace-nowrap">
            {item.badge}
          </span>
        </div>
        <div className="font-headingNow font-bold tracking-[-0.03em] leading-none text-[2rem] lg:text-[1.9rem] whitespace-nowrap max-w-full overflow-hidden">
          {item.display}
        </div>
      </div>
      <div>
        <h3 className="text-[20px] lg:text-[17px] leading-tight font-bold font-headingNow tracking-tight mb-1.5">
          {item.title}
        </h3>
        <p className="text-[14px] lg:text-[11.5px] font-dm_sans text-white/85 leading-relaxed lg:leading-snug">
          {item.description}
        </p>
        <div className="pt-2 mt-2.5 border-t border-white/25 flex items-center gap-1.5 text-[11px] lg:text-[10px] font-semibold font-geist_mono text-white/90">
          <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
          <span>{item.highlightText}</span>
        </div>
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
  const [hovered, setHovered] = useState<number | null>(null);

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

        {/* Desktop fan; mobile uses readable, touch-friendly cards below. */}
        {isDesktop ? (
          <motion.div
            className="relative w-full h-[560px]"
            onViewportEnter={() => setOpen(true)}
            viewport={{ once: true, amount: 0.6 }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => {
              setHovered(null);
              setOpen(false);
            }}
          >
            {criteria.map((item, i) => {
              const rel = i - mid;
              const isHover = open && hovered === i;
              const dir = hovered !== null && i < hovered ? -1 : 1;
              let x = 0;
              let y = 0;
              let rotate = 0;
              let scale = 1;
              if (open) {
                x = rel * 100;
                y = Math.abs(rel) * 12;
                rotate = rel * 15;
                if (hovered !== null) {
                  if (isHover) {
                    x = rel * 70;
                    y = -34;
                    rotate = 0;
                    scale = 1.08;
                  } else {
                    x += dir * 70;
                    rotate += dir * 7;
                  }
                }
              }
              return (
                <motion.div
                  key={item.title}
                  onMouseEnter={() => setHovered(i)}
                  animate={{ x, y, rotate, scale }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 24, mass: 0.8 }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 270,
                    height: 390,
                    marginLeft: -135,
                    marginTop: -195,
                    borderRadius: 24,
                    padding: 22,
                    transformOrigin: "50% 100%",
                    background: item.gradient,
                    boxShadow: "0 12px 24px rgba(17,26,18,0.28)",
                    backfaceVisibility: "hidden",
                    zIndex: isHover ? 50 : i === front ? 10 : 9 - Math.abs(i - front),
                    cursor: "pointer",
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
                className="flex min-w-0 flex-col rounded-[24px] p-5 sm:p-6 min-h-[300px] shadow-[0_6px_14px_rgba(17,26,18,0.16)]"
                style={{ background: item.gradient }}
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


