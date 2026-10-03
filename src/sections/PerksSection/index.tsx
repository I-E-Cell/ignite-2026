import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DraggableCardContainer,
  DraggableCardBody,
} from "@/components/ui/draggable-card";
import { DomainCarousel } from "./DomainCarousel";

interface BenefitCardData {
  id: string;
  title: string;
  badge: string;
  description: string;
  image: string;
  initialRotation: number;
  mobileClass: string;
  desktopClass: string;
  zIndex: number;
}

const benefitCards: BenefitCardData[] = [
  {
    id: "grant",
    title: "₹1,00,000 Seed Grant",
    badge: "Non-Dilutive Capital",
    description:
      "Milestone-based equity-free seed grant to convert your prototype into a production venture.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    initialRotation: -7,
    mobileClass: "left-[calc(50%-125px)] top-[14%]",
    desktopClass: "md:left-[5%] md:top-[8%] lg:left-[8%]",
    zIndex: 14,
  },
  {
    id: "mentorship",
    title: "Founder & VC Sessions",
    badge: "1-on-1 Office Hours",
    description:
      "Weekly direct office hours with venture capitalists, funded alumni operators, and seasoned mentors.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    initialRotation: 6,
    mobileClass: "left-[calc(50%-125px)] top-[17%]",
    desktopClass: "md:left-auto md:right-[5%] md:top-[6%] lg:right-[8%]",
    zIndex: 15,
  },
  {
    id: "visits",
    title: "Ecosystem & Tech Visits",
    badge: "Venture Immersion",
    description:
      "Curated delegation visits to premier startup incubators, tech parks, and regional VC offices.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    initialRotation: -4,
    mobileClass: "left-[calc(50%-125px)] top-[20%]",
    desktopClass: "md:left-[2%] md:top-[38%] lg:left-[4%]",
    zIndex: 12,
  },
  {
    id: "registration",
    title: "Startup Registration",
    badge: "Legal & Entity Support",
    description:
      "End-to-end guidance on company incorporation (Pvt Ltd), DPIIT recognition, trademarking, and IP.",
    image:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop",
    initialRotation: 5,
    mobileClass: "left-[calc(50%-125px)] top-[23%]",
    desktopClass: "md:left-auto md:right-[2%] md:top-[36%] lg:right-[4%]",
    zIndex: 13,
  },
  {
    id: "demo-day",
    title: "Final Pitch / Demo Day",
    badge: "The Grand Stage",
    description:
      "Pitch live on stage in front of active angel syndicates, venture capitalists, corporate partners, and press.",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    initialRotation: -8,
    mobileClass: "left-[calc(50%-125px)] top-[26%]",
    desktopClass: "md:left-[7%] md:top-auto md:bottom-[7%] lg:left-[11%]",
    zIndex: 16,
  },
  {
    id: "support",
    title: "Program Support & Credits",
    badge: "20-Week Backbone",
    description:
      "Hands-on venture management, dedicated maker lab access, cloud credits, and no-code tool stacks.",
    image:
      "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=800&auto=format&fit=crop",
    initialRotation: 7,
    mobileClass: "left-[calc(50%-125px)] top-[29%]",
    desktopClass: "md:left-auto md:right-[7%] md:top-auto md:bottom-[6%] lg:right-[11%]",
    zIndex: 17,
  },
];

export const PerksSection = () => {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <section
      id="perks"
      aria-label="What You Get in IGNITE"
      className="relative w-full bg-black text-lime-50 overflow-hidden"
    >
      {/* ─── WIDE BLACK TRANSITION & BOTANICAL ORNAMENT ("WHAT YOU GET") ─── */}
      <div className="relative w-full pt-20 sm:pt-28 md:pt-36 pb-6 md:pb-8 flex flex-col items-center justify-center text-center z-20 pointer-events-none select-none">
        {/* Botanical Motif */}
        <div className="flex justify-center mb-3 md:mb-4">
          <img
            src="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/artifact.png"
            alt=""
            aria-hidden="true"
            draggable="false"
            className="w-[clamp(114px,56.87px+15.87vw,240px)] h-auto opacity-[0.88] select-none pointer-events-none"
          />
        </div>

        {/* Eyebrow in place of 'THE SIX TRACKS' */}
        <span className="text-[11.5px] md:text-[13px] font-medium font-mono uppercase tracking-[0.25em] text-[#8FC45A] select-none">
          WHAT YOU GET
        </span>
      </div>

      {/* ─── FULL-SCREEN DRAGGABLE CARD STAGE ─── */}
      <div className="relative w-full min-h-[760px] md:min-h-[820px] lg:min-h-[880px] flex items-center justify-center overflow-hidden pb-12 select-none">
        {/* Subtle radial depth lighting behind stage */}
        <div
          className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(92,140,58,0.12)_0%,rgba(0,0,0,0)_75%)]"
          aria-hidden="true"
        />

        {/* Top Controls: Interactive pill hint and Reset button */}
        <div className="absolute top-2 md:top-4 inset-x-4 md:inset-x-8 flex items-center justify-between pointer-events-auto z-30">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#8FC45A] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-300">
              Drag cards anywhere
            </span>
          </div>

          <button
            onClick={handleReset}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-xs font-mono text-stone-300 hover:text-white transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
            title="Reset all cards to starting positions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Cards</span>
          </button>
        </div>

        {/* ─── BACKGROUND HEADER (BEHIND ALL CARDS) ─── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none z-0 px-6 max-w-4xl mx-auto">
          <h2
            className="tracking-tight leading-[1.08] text-neutral-800 dark:text-neutral-700 font-extrabold text-4xl sm:text-6xl md:text-7xl select-none"
            style={{
              fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            Everything to Build a Real Company
          </h2>

          <p
            className="mt-6 text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed select-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Not just trophies or certificates. IGNITE provides non-dilutive
            capital, elite founder mentorship, and institutional machinery to
            help you scale.
          </p>
        </div>

        {/* ─── 6 DRAGGABLE POLAROID CARDS ─── */}
        <DraggableCardContainer
          key={resetKey}
          className="relative z-10 w-full min-h-[760px] md:min-h-[820px] lg:min-h-[880px] flex items-center justify-center"
        >
          {benefitCards.map((card, idx) => (
            <DraggableCardBody
              key={card.id}
              style={{
                rotate: card.initialRotation,
                zIndex: card.zIndex,
              }}
              className={cn(
                "draggable-card-item absolute cursor-grab active:cursor-grabbing",
                "w-[250px] sm:w-[270px] min-h-[330px] sm:min-h-[340px] p-3.5 bg-[#141414] dark:bg-[#141414] border border-white/[0.12] shadow-[0_18px_50px_rgba(0,0,0,0.85),0_0_1px_rgba(255,255,255,0.2)]",
                card.mobileClass,
                card.desktopClass
              )}
            >
              {/* Photo Area */}
              <div className="card-image-box relative w-full h-40 sm:h-44 overflow-hidden rounded-lg bg-neutral-950 border border-black/40">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  loading="lazy"
                  draggable={false}
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/10 text-[10px] font-mono text-lime-300 font-bold card-badge">
                  0{idx + 1}
                </div>
              </div>

              {/* Caption Area (Polaroid Footer) */}
              <div className="mt-3 px-0.5 flex flex-col">
                <span className="text-[10.5px] font-semibold tracking-wider uppercase font-mono text-[#8FC45A]">
                  {card.badge}
                </span>

                <h3
                  className="text-base font-bold text-white tracking-tight mt-1 leading-snug"
                  style={{ fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif" }}
                >
                  {card.title}
                </h3>

                <p
                  className="text-[11.5px] text-stone-300 mt-1 line-clamp-2 leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {card.description}
                </p>
              </div>
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>
      </div>

      {/* ─── IDEA DOMAINS AUTO-SHIFTING 3D COVERFLOW SECTION ─── */}
      <div className="relative w-full pb-24 z-20 overflow-hidden">
        <DomainCarousel />
      </div>
    </section>
  );
};
