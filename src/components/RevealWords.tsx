import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface RevealWordsProps {
  paragraphs: string[];
  className?: string;
  start?: string;
  end?: string;
  dim?: number;
}

export const RevealWords = ({
  paragraphs,
  className = "",
  start = "top 84%",
  end = "bottom 38%",
  dim = 0.18,
}: RevealWordsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = gsap.utils.toArray<HTMLElement>(".rw-word", el);
    if (!words.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(words, { opacity: 1, y: 0 });
      return;
    }

    const isTouchOrSmall = window.matchMedia(
      "(pointer: coarse), (max-width: 768px)"
    ).matches;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: isTouchOrSmall ? 0.35 : 0.7,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          words,
          {
            opacity: dim,
            y: isTouchOrSmall ? 2 : 4,
          },
          {
            opacity: 1,
            y: 0,
            force3D: true,
            ease: "power1.out",
            stagger: {
              each: isTouchOrSmall ? 0.018 : 0.035,
              ease: "none",
            },
          }
        );
    }, el);

    const refresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("recursive-intro-done", refresh);
    window.addEventListener("resize", refresh);
    const t1 = setTimeout(refresh, 200);
    const t2 = setTimeout(refresh, 800);

    return () => {
      ctx.revert();
      window.removeEventListener("recursive-intro-done", refresh);
      window.removeEventListener("resize", refresh);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [start, end, dim]);

  return (
    <div ref={containerRef} className={`rw ${className}`}>
      {paragraphs.map((para, pIdx) => (
        <p key={pIdx} className="rw-para">
          {para.split(/\s+/).map((word, wIdx) => (
            <span key={wIdx} className="rw-word-wrap inline-block mr-[0.28em]">
              <span
                className="rw-word inline-block transition-[color,text-shadow] duration-200"
                style={{
                  opacity: dim,
                  willChange: "opacity, transform",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </p>
      ))}
    </div>
  );
};
