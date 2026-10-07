import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  GraduationCap,
  HeartPulse,
  TrendingUp,
  Leaf,
  School,
  Sparkles,
  Compass,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainItem {
  id: string;
  number: string;
  name: string;
  tag: string;
  subtitle: string;
  accentColor: string;
  glowColor: string;
  icon: LucideIcon;
  description: string;
  focusAreas: string[];
}

const ideaDomains: DomainItem[] = [
  {
    id: "edtech",
    number: "01",
    name: "EdTech & Learning",
    tag: "Education",
    subtitle: "Student SaaS & Synthesis",
    accentColor: "#8FC45A",
    glowColor: "rgba(143, 196, 90, 0.16)",
    icon: GraduationCap,
    description:
      "Tools for student productivity, skill mastery, exam synthesis, and automated campus academic workflows.",
    focusAreas: ["Campus Workflow SaaS", "Autonomous Study Aides", "Skill Verification"],
  },
  {
    id: "health",
    number: "02",
    name: "HealthTech & Wellness",
    tag: "HealthTech",
    subtitle: "Prevention & Digital Care",
    accentColor: "#4ADE80",
    glowColor: "rgba(74, 222, 128, 0.16)",
    icon: HeartPulse,
    description:
      "Preventative wellness, stress mitigation, micro-habit architecture, and digital clinical assistants for youth.",
    focusAreas: ["Micro-habit Systems", "Mental Wellness Tools", "Preventative Care Logs"],
  },
  {
    id: "fintech",
    number: "03",
    name: "FinTech & Payments",
    tag: "Finance",
    subtitle: "Financial Primitives & Rails",
    accentColor: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.16)",
    icon: TrendingUp,
    description:
      "Micro-savings, student credit protocols, intelligent budget trackers, and friction-free peer-to-peer rails.",
    focusAreas: ["Micro-saving Primitives", "P2P Payment Rails", "Expense Reconciliation"],
  },
  {
    id: "sustainability",
    number: "04",
    name: "Sustainability & Climate",
    tag: "CleanTech",
    subtitle: "Circular Systems & Energy",
    accentColor: "#34D399",
    glowColor: "rgba(52, 211, 153, 0.16)",
    icon: Leaf,
    description:
      "Material circularity, energy auditing, localized waste mitigation, and clean mobility platforms.",
    focusAreas: ["Circular Asset Sharing", "Localized Carbon Audits", "Waste Diversion SaaS"],
  },
  {
    id: "campus",
    number: "05",
    name: "Campus Life & Community",
    tag: "Hyperlocal",
    subtitle: "Collegiate & Hostel Friction",
    accentColor: "#FBBF24",
    glowColor: "rgba(251, 191, 36, 0.16)",
    icon: School,
    description:
      "Solving daily student friction in hostel management, collegiate festivals, mess queues, and peer networks.",
    focusAreas: ["Hostel Logistics OS", "Event Access Systems", "Community Marketplaces"],
  },
  {
    id: "open",
    number: "06",
    name: "Open Innovation & Moonshots",
    tag: "Moonshots",
    subtitle: "Autonomous AI & Unconstrained",
    accentColor: "#A78BFA",
    glowColor: "rgba(167, 139, 250, 0.16)",
    icon: Sparkles,
    description:
      "Radical, cross-disciplinary software, local autonomous agents, and dev tools breaking traditional molds.",
    focusAreas: ["Autonomous AI Agents", "Developer Workflows", "Next-Gen User Interfaces"],
  },
];

// Atmospheric Living Background Visuals for each domain
const DomainAtmosphere: React.FC<{ id: string; color: string }> = ({ id, color }) => {
  if (id === "edtech") {
    return (
      <svg className="w-28 h-28 pointer-events-none" viewBox="0 0 100 100" fill="none">
        <motion.circle
          cx="28"
          cy="28"
          r="4"
          fill={color}
          animate={{ scale: [1, 1.4, 1], opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="72"
          cy="38"
          r="5"
          fill={color}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
        />
        <motion.circle
          cx="44"
          cy="74"
          r="4"
          fill={color}
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
        />
        <line x1="28" y1="28" x2="72" y2="38" stroke={color} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.3" />
        <line x1="72" y1="38" x2="44" y2="74" stroke={color} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.3" />
        <line x1="44" y1="74" x2="28" y2="28" stroke={color} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.3" />
      </svg>
    );
  }

  if (id === "health") {
    return (
      <svg className="w-32 h-20 pointer-events-none" viewBox="0 0 120 60" fill="none">
        <motion.path
          d="M0 30 L32 30 L40 10 L50 50 L60 18 L70 42 L80 30 L120 30"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0.3, pathOffset: 0 }}
          animate={{ pathOffset: [0, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    );
  }

  if (id === "fintech") {
    return (
      <svg className="w-28 h-28 pointer-events-none" viewBox="0 0 100 100" fill="none">
        <motion.rect
          x="18"
          y="56"
          width="13"
          height="32"
          rx="3"
          fill={color}
          opacity="0.35"
          animate={{ height: [22, 42, 22], y: [66, 46, 66] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.rect
          x="41"
          y="38"
          width="13"
          height="50"
          rx="3"
          fill={color}
          opacity="0.55"
          animate={{ height: [38, 58, 38], y: [50, 30, 50] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
        />
        <motion.rect
          x="64"
          y="22"
          width="13"
          height="66"
          rx="3"
          fill={color}
          opacity="0.75"
          animate={{ height: [52, 72, 52], y: [36, 16, 36] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
        />
        <motion.path
          d="M12 68 L42 36 L66 46 L90 14"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="4 4"
          opacity="0.8"
        />
      </svg>
    );
  }

  if (id === "sustainability") {
    return (
      <svg className="w-28 h-28 pointer-events-none" viewBox="0 0 100 100" fill="none">
        <motion.circle
          cx="50"
          cy="50"
          r="34"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="6 6"
          opacity="0.35"
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          style={{ originX: "50px", originY: "50px" }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.25"
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ originX: "50px", originY: "50px" }}
        />
        <motion.circle
          cx="50"
          cy="16"
          r="3.5"
          fill={color}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    );
  }

  if (id === "campus") {
    return (
      <svg className="w-28 h-28 pointer-events-none" viewBox="0 0 100 100" fill="none">
        <motion.circle
          cx="50"
          cy="50"
          r="12"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.75"
          animate={{ scale: [1, 2.6], opacity: [0.75, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          style={{ originX: "50px", originY: "50px" }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="12"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.75"
          animate={{ scale: [1, 2.6], opacity: [0.75, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
          style={{ originX: "50px", originY: "50px" }}
        />
        <circle cx="50" cy="50" r="4.5" fill={color} />
      </svg>
    );
  }

  // Open Innovation / Moonshots
  return (
    <svg className="w-28 h-28 pointer-events-none" viewBox="0 0 100 100" fill="none">
      <motion.path
        d="M50 14 Q50 50 86 50 Q50 50 50 86 Q50 50 14 50 Q50 50 50 14"
        fill={color}
        opacity="0.25"
        animate={{ rotate: 360, scale: [0.88, 1.12, 0.88] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ originX: "50px", originY: "50px" }}
      />
      <motion.circle
        cx="74"
        cy="26"
        r="2.5"
        fill={color}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx="26"
        cy="74"
        r="2"
        fill={color}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 0.8 }}
      />
    </svg>
  );
};

// Interactive 3D Holographic Card with Cursor Spotlight & Parallax Depth
const InteractiveDomainCard: React.FC<{ domain: DomainItem }> = ({ domain }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinate springs for 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), {
    stiffness: 300,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set CSS variables for GPU-accelerated spotlight
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);

    mouseX.set(x / rect.width);
    mouseY.set(y / rect.height);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const Icon = domain.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className="relative h-full rounded-2xl group cursor-pointer select-none active:scale-[0.98] transition-transform duration-200"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 min-h-[350px] sm:min-h-[370px] h-full overflow-hidden",
          "bg-gradient-to-b from-[#111913]/90 via-[#0a110d]/95 to-[#060907]/98",
          "border border-white/[0.08] transition-colors duration-300",
          "group-hover:border-white/[0.22]"
        )}
      >
        {/* ─── 1. Cursor-Tracking Spotlight & Border Sheen ─── */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(380px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${domain.glowColor}, transparent 80%)`,
          }}
          aria-hidden="true"
        />

        {/* Ambient Top Glow Line */}
        <div
          className="absolute inset-x-8 top-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${domain.accentColor}, transparent)`,
          }}
          aria-hidden="true"
        />

        {/* ─── 2. Atmospheric Micro-Visual in Top-Right ─── */}
        <div
          className="absolute -top-3 -right-3 opacity-30 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
          style={{ transform: "translateZ(15px)" }}
        >
          <DomainAtmosphere id={domain.id} color={domain.accentColor} />
        </div>

        {/* ─── 3. Parallax Header: Icon + Category Tag + Number ─── */}
        <div style={{ transform: "translateZ(35px)" }}>
          <div className="flex items-center justify-between gap-3 mb-6 relative z-10">
            {/* Glowing Icon Container */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border"
              style={{
                backgroundColor: isHovered ? `${domain.accentColor}25` : "rgba(255, 255, 255, 0.04)",
                borderColor: isHovered ? `${domain.accentColor}60` : "rgba(255, 255, 255, 0.08)",
                boxShadow: isHovered ? `0 0 20px ${domain.glowColor}` : "none",
                transform: isHovered ? "scale(1.08)" : "scale(1)",
              }}
            >
              <Icon
                className="w-6 h-6 transition-colors duration-300"
                style={{ color: isHovered ? "#ffffff" : domain.accentColor }}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-stone-300 font-medium">
                {domain.tag}
              </span>
              <span
                className="text-xs font-mono font-bold"
                style={{ color: domain.accentColor }}
              >
                {domain.number} /
              </span>
            </div>
          </div>

          {/* ─── 4. Domain Name & Tagline ─── */}
          <h4
            className="text-xl sm:text-[23px] font-bold text-lime-50 tracking-tight leading-snug group-hover:text-white transition-colors flex items-center justify-between"
            style={{
              fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            <span>{domain.name}</span>
            <ArrowUpRight
              className="w-4 h-4 transition-all duration-300 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: domain.accentColor }}
            />
          </h4>

          {/* Monospace Subtitle Tagline */}
          <span
            className="block text-xs font-mono mt-1.5 font-medium transition-colors duration-300"
            style={{ color: isHovered ? domain.accentColor : "#9dbc81" }}
          >
            {domain.subtitle}
          </span>

          {/* Description */}
          <p
            className="text-xs sm:text-[13.5px] text-stone-400 mt-3 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {domain.description}
          </p>
        </div>

        {/* ─── 5. Parallax Footer: Problem Space Focus Tags ─── */}
        <div
          className="pt-4 border-t border-white/[0.06] mt-6 relative z-10"
          style={{ transform: "translateZ(25px)" }}
        >
          <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-2">
            Sample Problem Spaces
          </span>
          <div className="flex flex-wrap gap-1.5">
            {domain.focusAreas.map((area, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono text-stone-300/90 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-md group-hover:border-white/[0.14] transition-colors"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const DomainCarousel: React.FC = () => {
  return (
    <section
      aria-label="Supported Domains and Verticals"
      className="relative w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 select-none"
    >
      {/* ─── Ambient Atmospheric Depth Lighting ─── */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-[#5C8C3A]/[0.06] rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* ─── Editorial Header ─── */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
          <Compass className="w-3.5 h-3.5 text-[#8FC45A]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9dbc81] font-semibold">
            Track-Agnostic Incubation
          </span>
        </div>

        <h3
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#eff4e8] tracking-tight leading-[1.12]"
          style={{
            fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.03em",
          }}
        >
          Your Idea Can Come From Anywhere
        </h3>

        <p
          className="mt-4 text-sm sm:text-base text-stone-400 max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          IGNITE is completely vertical-agnostic. Whether you are re-engineering finance,
          optimizing campus life, or building unconstrained software, we back execution
          velocity and real-world friction solved.
        </p>
      </div>

      {/* ─── 3D Holographic Parallax Card Grid ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
      >
        {ideaDomains.map((domain) => (
          <InteractiveDomainCard key={domain.id} domain={domain} />
        ))}
      </motion.div>

      {/* ─── Reassurance Footer Banner ─── */}
      <div className="mt-12 sm:mt-14 p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-400">
        <span className="inline-block w-2 h-2 rounded-full bg-[#8FC45A] animate-pulse" />
        <span style={{ fontFamily: "'Inter', sans-serif" }}>
          <strong className="text-stone-200 font-medium">Building something different?</strong>{" "}
          All novel software and hardware ideas are eligible for the ₹1,00,000 grant.
        </span>
      </div>
    </section>
  );
};

export default DomainCarousel;
