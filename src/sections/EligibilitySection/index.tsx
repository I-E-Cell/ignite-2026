import { useEffect, useState } from "react";
import { UserCheck, Users2, Shuffle, Lock } from "lucide-react";
import { motion } from "motion/react";

export const EligibilitySection = () => {
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

  const mid = (criteria.length - 1) / 2;

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  // Random card on top of the collapsed stack (and front of the fan); never the same twice in a row
  const [front, setFront] = useState(1);
  const pickFront = () =>
    setFront((prev) => {
      const others = criteria.map((_, k) => k).filter((k) => k !== prev);
      return others[Math.floor(Math.random() * others.length)];
    });
  useEffect(() => {
    pickFront();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CardBody = ({ item }: { item: (typeof criteria)[number] }) => {
    const Icon = item.icon;
    return (
      <div className="relative h-full w-full min-w-0 flex flex-col justify-between text-left text-white break-words">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Icon className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[9px] font-semibold font-geist_mono uppercase tracking-wider px-2 py-1 rounded-full bg-white/20 whitespace-nowrap">
              {item.badge}
            </span>
          </div>
          <div className="font-headingNow font-bold tracking-[-0.03em] leading-none text-[1.9rem] whitespace-nowrap max-w-full overflow-hidden">
            {item.display}
          </div>
        </div>
        <div>
          <h3 className="text-[17px] leading-tight font-bold font-headingNow tracking-tight mb-1.5">
            {item.title}
          </h3>
          <p className="text-[11.5px] font-dm_sans text-white/85 leading-snug">
            {item.description}
          </p>
          <div className="pt-2 mt-2.5 border-t border-white/25 flex items-center gap-1.5 text-[10px] font-semibold font-geist_mono text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
            <span>{item.highlightText}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="eligibility"
      aria-label="Who Can Join IGNITE"
      className="relative w-full pt-16 pb-24 px-5 md:px-12 lg:px-16 text-neutral-900 bg-transparent overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center mb-16">
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
              fontSize: "clamp(2.2rem, 4.5vw, 44px)",
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

        {/* Desktop: collapsed stack that fans out (hover the stage or scroll into view) */}
        <motion.div
          className="hidden lg:block relative w-full h-[560px]"
          onViewportEnter={() => setOpen(true)}
          viewport={{ once: true, amount: 0.6 }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => {
            setHovered(null);
            setOpen(false);
            pickFront();
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
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
                  boxShadow: isHover
                    ? "0 30px 60px rgba(17,26,18,0.4)"
                    : "0 20px 40px rgba(17,26,18,0.3)",
                  zIndex: isHover ? 50 : i === front ? 10 : 10 - Math.abs(i - front),
                  cursor: "pointer",
                  overflow: "hidden",
                  willChange: "transform",
                }}
              >
                <CardBody item={item} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tablet / mobile: stacked cards rising one after another */}
        <div className="lg:hidden w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          {criteria.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-[24px] p-6 min-h-[320px] shadow-[0_14px_30px_rgba(17,26,18,0.2)]`}
              style={{ background: item.gradient }}
            >
              <CardBody item={item} />
            </motion.div>
          ))}
        </div>

        {/* Eligibility Bottom Banner */}
        <div className="mt-10 px-6 py-4 rounded-xl bg-[#5C8C3A]/10 border border-[#5C8C3A]/25 text-center max-w-xl text-xs sm:text-sm font-dm_sans text-[#1B3519]">
          <strong>Note:</strong> Teams can include members from different years and departments. Cross-functional teams are strongly encouraged.
        </div>
      </div>
    </section>
  );
};
