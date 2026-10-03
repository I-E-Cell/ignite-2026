import { CrowdCanvas } from "@/sections/Footer/components/CrowdCanvas";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-shell relative min-h-[clamp(240px,58vh,660px)] h-[clamp(240px,58vh,660px)] w-full bg-transparent text-[#142617] overflow-hidden select-none flex flex-col justify-end">
      {/* Luminous radial glow behind the letters */}
      <div className="footer-aurora" aria-hidden="true" />

      {/* Giant RECURSIVE Wordmark */}
      <div className="footer-wordmark-wrap">
        <span className="sr-only">
          IGNITE — No-Code Startup Hackathon 2026 | I&amp;E Cell, Army Institute of Technology, Pune
        </span>
        <div
          className="warp-text relative w-full max-w-[100vw] h-full pointer-events-auto"
          role="heading"
          aria-level={2}
          aria-label="IGNITE"
        >
          <div
            className="warp-text-fallback-txt absolute inset-0 flex items-end justify-center font-headingNow font-black text-[min(clamp(7.5rem,34vw,42rem),60vh)] tracking-[-0.035em] leading-[0.82] select-none"
            style={{
              background:
                "linear-gradient(180deg, #070e08 0%, #0f1c12 36%, #1a301e 72%, #2c4e30 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            IGNITE
          </div>
        </div>
      </div>

      {/* Doodle Army Canvas */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <CrowdCanvas
          src="https://www.recursiveacm.in/images/peeps/all-peeps.png"
          rows={15}
          cols={7}
        />
      </div>

      {/* Bottom Cutout Fade */}
      <div className="footer-cutout-fade" aria-hidden="true" />

      {/* Back to Top Button */}
      <div className="absolute bottom-6 right-6 pointer-events-auto z-[110]">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="group w-10 h-10 rounded-full bg-white/90 border border-black/[0.12] hover:border-[#5C8C3A]/60 flex items-center justify-center text-[#142617] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
            aria-hidden="true"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>

      <style>{`
        .footer-shell {
          margin-top: clamp(4rem, 9vh, 7.5rem);
        }

        .footer-wordmark-wrap {
          position: absolute;
          inset-inline: 0;
          bottom: clamp(-2.8rem, -4.8vh, -1.5rem);
          height: min(clamp(280px, 56vh, 640px), 92%);
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          pointer-events: auto;
          user-select: none;
          padding-inline: clamp(0.2rem, 1.2vw, 1rem);
        }

        @media (max-width: 1024px) {
          footer.footer-shell {
            min-height: clamp(240px, 44vw, 440px);
            height: clamp(240px, 44vw, 440px);
            margin-top: clamp(2rem, 4vh, 3.5rem);
          }
          .footer-wordmark-wrap {
            bottom: clamp(-1.8rem, -3.2vh, -0.9rem);
            height: 94%;
            padding-inline: 1vw;
          }
        }

        @media (max-width: 620px) {
          footer.footer-shell {
            min-height: clamp(200px, 54vw, 290px);
            height: clamp(200px, 54vw, 290px);
            margin-top: clamp(1rem, 2vh, 2rem);
          }
          .footer-wordmark-wrap {
            bottom: 0;
            height: 96%;
            padding-inline: 0;
          }
        }

        .footer-aurora {
          position: absolute;
          inset: auto 0 0 0;
          height: 75%;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% 88%, rgba(143, 196, 90, 0.22) 0%, rgba(92, 140, 58, 0.06) 55%, transparent 85%),
            radial-gradient(ellipse 50% 40% at 15% 80%, rgba(200, 224, 180, 0.24) 0%, transparent 68%),
            radial-gradient(ellipse 50% 40% at 85% 80%, rgba(180, 215, 170, 0.24) 0%, transparent 68%);
        }

        .footer-cutout-fade {
          position: absolute;
          inset: auto 0 0 0;
          height: clamp(34px, 12.5%, 72px);
          z-index: 25;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(4, 10, 5, 0) 0%,
            rgba(4, 10, 5, 0.45) 30%,
            rgba(3, 8, 4, 0.88) 65%,
            #020603 100%
          );
        }
      `}</style>
    </footer>
  );
};