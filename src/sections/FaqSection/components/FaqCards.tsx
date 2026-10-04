import { useEffect, useRef, useState } from "react";

export type FaqCardItem = { question: string; answer: string };

// Subtle, organic alternating tilt per card (degrees)
const TILTS = [-1.5, 1.2, 1.0, -1.2, -1.0, 1.4, -1.2, 1.0];

// Clean unified mono color palette for all cards
const MONO_TONE = {
  card: "bg-white/95 text-[#141412] border-stone-200/80 hover:border-[#3f6212]/35 shadow-[0_8px_28px_-12px_rgba(20,20,18,0.12)]",
  chip: "bg-[#3f6212]/10 text-[#3f6212] group-hover:bg-[#3f6212]/20",
};

export const FaqCards = ({ items }: { items: FaqCardItem[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Reveal when the grid scrolls into view
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-x-7 md:gap-y-6"
    >
      {items.map((item, i) => {
        const tilt = TILTS[i % TILTS.length];
        const open = openIndex === i;

        return (
          // Outer wrapper: entrance + balanced subtle column alignment
          <div
            key={item.question}
            className="md:odd:translate-y-0 md:even:translate-y-3"
          >
            <div
              className="transition-all duration-700 ease-out motion-reduce:transition-none"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0)" : "translateY(28px)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              {/* Card: smooth curved pill corners (rounded-[32px]), mono color, subtle tilt */}
              <div
                style={{ ["--tilt" as string]: `${tilt}deg` }}
                className={`group rounded-[32px] border p-6 md:p-7 transition-all duration-300 ease-out motion-reduce:[transform:none] ${
                  MONO_TONE.card
                } ${
                  open
                    ? "[transform:rotate(0deg)] shadow-[0_20px_44px_-16px_rgba(20,20,18,0.22)] ring-2 ring-[#3f6212]/20"
                    : "[transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)_scale(1.015)] hover:shadow-[0_16px_36px_-12px_rgba(20,20,18,0.18)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6212] focus-visible:ring-offset-2 rounded-2xl cursor-pointer"
                >
                  <span className="text-[17px] font-bold leading-snug md:text-[18px] text-[#141412] group-hover:text-black transition-colors">
                    {item.question}
                  </span>
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                      MONO_TONE.chip
                    } ${open ? "rotate-180 bg-[#3f6212] text-white" : ""}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>

                {/* Smooth height animation without measuring */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                    open
                      ? "grid-rows-[1fr] opacity-100 mt-4"
                      : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-3 border-t border-stone-200/60">
                      <p className="whitespace-pre-line text-[15px] md:text-[16px] leading-relaxed text-stone-700 font-dm_sans">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqCards;
