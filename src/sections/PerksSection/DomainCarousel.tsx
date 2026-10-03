import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  HeartPulse,
  TrendingUp,
  Leaf,
  School,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainItem {
  id: string;
  number: string;
  name: string;
  tag: string;
  icon: typeof GraduationCap;
  description: string;
  highlightColor: string;
  bgGradient: string;
}

const ideaDomains: DomainItem[] = [
  {
    id: "edtech",
    number: "01",
    name: "EdTech & Learning",
    tag: "Education",
    icon: GraduationCap,
    description:
      "Tools for students, skill building, exam prep, and modern campus workflows.",
    highlightColor: "#8FC45A",
    bgGradient: "from-[#173019] via-[#0f2111] to-[#0a140b]",
  },
  {
    id: "health",
    number: "02",
    name: "Health & Wellness",
    tag: "HealthTech",
    icon: HeartPulse,
    description:
      "Preventative care, mental wellness, habit tracking, and campus clinical tools.",
    highlightColor: "#4ADE80",
    bgGradient: "from-[#132c1b] via-[#0c1f13] to-[#08150c]",
  },
  {
    id: "fintech",
    number: "03",
    name: "FinTech & Payments",
    tag: "Finance",
    icon: TrendingUp,
    description:
      "Micro-savings, student credit, budget intelligence, and peer-to-peer payments.",
    highlightColor: "#38BDF8",
    bgGradient: "from-[#102a33] via-[#0a1c22] to-[#071317]",
  },
  {
    id: "sustainability",
    number: "04",
    name: "Sustainability & Climate",
    tag: "CleanTech",
    icon: Leaf,
    description:
      "Waste reduction, circular materials, green mobility, and energy optimization.",
    highlightColor: "#34D399",
    bgGradient: "from-[#0f2d24] via-[#091f18] to-[#061410]",
  },
  {
    id: "campus",
    number: "05",
    name: "Campus Life & Community",
    tag: "Social",
    icon: School,
    description:
      "Solving hyper-local challenges for college festivals, hostels, and youth groups.",
    highlightColor: "#FBBF24",
    bgGradient: "from-[#2f2812] via-[#201b0b] to-[#120f06]",
  },
  {
    id: "open",
    number: "06",
    name: "Open Innovation",
    tag: "Moonshot",
    icon: Sparkles,
    description:
      "Radical, cross-disciplinary software ideas that break conventional boundaries.",
    highlightColor: "#A78BFA",
    bgGradient: "from-[#261836] via-[#1a1025] to-[#100a17]",
  },
];

export const DomainCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = ideaDomains.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Auto-advance every 3.2 seconds with smooth transitions
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="relative w-full max-w-6xl mx-auto px-4 py-10 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ─── Header: Exact Match to Demo Wireframe ─── */}
      <div className="text-center mb-12 sm:mb-16">
        <h3
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-lime-50 tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}
        >
          Your Idea Can Come From Anywhere
        </h3>
        <p className="mt-2 text-sm sm:text-base font-semibold tracking-[0.2em] uppercase font-mono text-[#8FC45A]">
          Any Domain Welcome
        </p>
        <p
          className="mt-3 text-xs sm:text-sm text-stone-400 max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          We care about real problem solving. Build solutions for challenges you
          or your community experience daily.
        </p>
      </div>

      {/* ─── 5-Card Coverflow / Carousel Stage ─── */}
      <div className="relative w-full h-[300px] sm:h-[320px] md:h-[340px] flex items-center justify-center overflow-visible">
        {/* Ambient subtle glow beneath active card */}
        <div
          className="absolute w-72 h-44 rounded-full bg-[#5C8C3A]/20 blur-3xl pointer-events-none -z-10 transition-all duration-700"
          style={{
            transform: "translateY(20px)",
          }}
        />

        {ideaDomains.map((domain, index) => {
          const Icon = domain.icon;

          // Normalized offset relative to active card in [-count/2, count/2]
          let offset = (index - activeIndex + count) % count;
          if (offset > count / 2) offset -= count;

          const isCenter = offset === 0;
          const isImmediate = Math.abs(offset) === 1;
          const isOuter = Math.abs(offset) === 2;
          const isVisible = Math.abs(offset) <= 2;

          // Motion coordinates & scale tailored for 5 visible cards
          let xPercent = 0;
          let scale = 1;
          let opacity = 0;
          let zIndex = 0;
          let rotateY = 0;

          if (isCenter) {
            xPercent = 0;
            scale = 1;
            opacity = 1;
            zIndex = 20;
            rotateY = 0;
          } else if (offset === -1) {
            // Immediate Left
            xPercent = -62;
            scale = 0.85;
            opacity = 0.75;
            zIndex = 15;
            rotateY = 8;
          } else if (offset === 1) {
            // Immediate Right
            xPercent = 62;
            scale = 0.85;
            opacity = 0.75;
            zIndex = 15;
            rotateY = -8;
          } else if (offset === -2) {
            // Far Left
            xPercent = -118;
            scale = 0.72;
            opacity = 0.35;
            zIndex = 10;
            rotateY = 16;
          } else if (offset === 2) {
            // Far Right
            xPercent = 118;
            scale = 0.72;
            opacity = 0.35;
            zIndex = 10;
            rotateY = -16;
          } else {
            // Hidden cards waiting offstage
            xPercent = offset > 0 ? 170 : -170;
            scale = 0.55;
            opacity = 0;
            zIndex = 0;
            rotateY = offset > 0 ? -25 : 25;
          }

          return (
            <motion.div
              key={domain.id}
              onClick={() => setActiveIndex(index)}
              animate={{
                x: `${xPercent}%`,
                scale,
                opacity,
                zIndex,
                rotateY,
              }}
              transition={{
                type: "spring",
                stiffness: 190,
                damping: 24,
                mass: 0.75,
              }}
              style={{
                perspective: 1200,
                transformStyle: "preserve-3d",
              }}
              className={cn(
                "domain-carousel-card absolute w-[280px] sm:w-[330px] md:w-[360px] h-[220px] sm:h-[240px] md:h-[250px] p-6 flex flex-col justify-between cursor-pointer transition-colors duration-300",
                isCenter
                  ? "bg-gradient-to-b from-[#18281a] via-[#101b12] to-[#0a120b] border-2 border-[#5C8C3A] shadow-[0_16px_50px_rgba(92,140,58,0.3),0_0_25px_rgba(143,196,90,0.15)] ring-1 ring-[#8FC45A]/40"
                  : "bg-[#111312]/85 hover:bg-[#151a14] border border-white/10 hover:border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-md",
                !isVisible && "pointer-events-none"
              )}
            >
              {/* Header: Icon + Domain Number */}
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                    isCenter
                      ? "bg-[#5C8C3A] text-white shadow-md shadow-[#5C8C3A]/50 scale-105"
                      : "bg-white/[0.06] text-[#8FC45A] border border-white/10"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full domain-carousel-pill bg-white/[0.06] border border-white/10 text-stone-300 font-semibold">
                    {domain.tag}
                  </span>
                  <span className="text-xs font-mono text-stone-400 font-bold">
                    {domain.number}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="my-auto pt-2">
                <h4
                  className={cn(
                    "text-xl sm:text-2xl font-bold tracking-tight leading-snug transition-colors",
                    isCenter ? "text-lime-50" : "text-stone-300"
                  )}
                  style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif" }}
                >
                  {domain.name}
                </h4>

                <p
                  className="text-xs sm:text-[13px] text-stone-400 mt-1.5 line-clamp-2 leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {domain.description}
                </p>
              </div>

              {/* Footer indicator */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                <span
                  className={cn(
                    "transition-colors",
                    isCenter
                      ? "text-[#8FC45A] font-semibold"
                      : "text-stone-400"
                  )}
                >
                  {isCenter ? "Active Category" : "Click to view"}
                </span>

                {isCenter && (
                  <span className="inline-flex items-center gap-1 text-[#8FC45A] font-semibold">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Controls: Prev / Next Buttons & Domain Indicators ─── */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={prevSlide}
          type="button"
          aria-label="Previous domain"
          className="w-9 h-9 rounded-full domain-carousel-pill bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dots with smooth width expansion */}
        <div className="flex items-center gap-2">
          {ideaDomains.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full domain-carousel-pill transition-all duration-300 cursor-pointer",
                i === activeIndex
                  ? "w-7 bg-[#8FC45A] shadow-[0_0_10px_rgba(143,196,90,0.6)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          type="button"
          aria-label="Next domain"
          className="w-9 h-9 rounded-full domain-carousel-pill bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
