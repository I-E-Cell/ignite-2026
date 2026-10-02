import { useEffect, useState } from "react";
import { HeroMedia } from "@/sections/HeroSection/components/HeroMedia";
import { HeroActions } from "@/sections/HeroSection/components/HeroActions";
import { HeroScrollCue } from "@/sections/HeroSection/components/HeroScrollCue";

export const HeroSection = () => {
  const [isRevealed, setIsRevealed] = useState(() => {
    if (typeof document === "undefined") return true;
    return document.documentElement.dataset.intro === "done";
  });

  useEffect(() => {
    if (isRevealed) return;

    const onIntroDone = () => setIsRevealed(true);
    window.addEventListener("recursive-intro-done", onIntroDone);

    const observer = new MutationObserver(() => {
      if (document.documentElement.dataset.intro === "done") {
        setIsRevealed(true);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-intro"],
    });

    // Fallback safeguard in case intro was bypassed or failed
    const timer = setTimeout(() => setIsRevealed(true), 16000);

    return () => {
      window.removeEventListener("recursive-intro-done", onIntroDone);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [isRevealed]);

  const easeCurve = "cubic-bezier(0.23, 1, 0.32, 1)";

  return (
    <section id="hero" className="hero">
      <HeroMedia />

      <div className="hero-content-flex">
        {/* Sky Zone — top 50svh: logo lives here */}
        <div className="hero-sky-zone">
          <div
            id="headingrow"
            className="hero-center-content"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 0.7s ${easeCurve} 0.02s, transform 0.7s ${easeCurve} 0.02s`,
            }}
          >
            <h1 className="sr-only">IGNITE 2026 — No-Code Startup Hackathon by I&amp;E Cell</h1>
            <p className="sr-only">Official website for IGNITE 2026 No-Code Startup Hackathon. Round 1 in Sept 2026. A 20-week startup journey with ₹1,00,000 grant.</p>

            {/* Pill Badge matching div.powered-pill */}
            <div
              className="inline-flex items-center justify-center gap-2.5 px-[22px] h-[42px] rounded-full shadow-xs mb-2 sm:mb-3"
              style={{
                backgroundColor: "#FBFAF8",
                border: "1px solid #D6D4CB",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "6px",
                  backgroundColor: "#141412",
                }}
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  lineHeight: "18px",
                  letterSpacing: "1.8px",
                  textTransform: "uppercase",
                  color: "#141412",
                }}
              >
                Round 1 · Sept 2026
              </span>
            </div>

            {/* Monumental IGNITE Brand Title matching h1.hero-wordmark */}
            <div className="hero-warp-wrap flex items-center justify-center">
              <div
                role="heading"
                aria-level={2}
                aria-label="IGNITE"
                className="warp-text flex items-center justify-center w-full"
                style={{ position: "relative", pointerEvents: "auto" }}
              >
                <span
                  className="uppercase select-none text-[clamp(4.2rem,14vw,176px)] leading-[0.86]"
                  style={{
                    fontFamily: "'Baloo 2', cursive, sans-serif",
                    fontWeight: 800,
                    letterSpacing: "1.76px",
                    color: "#141412",
                    filter: "drop-shadow(0 4px 20px rgba(20, 20, 18, 0.15))",
                  }}
                >
                  IGNITE
                </span>
              </div>
            </div>

            {/* NO-CODE STARTUP HACKATHON Subtitle */}
            <div className="mt-1">
              <span
                className="uppercase select-none text-[clamp(1.1rem,2.6vw,30.4px)] leading-[1.3] block"
                style={{
                  fontFamily: "'Baloo 2', cursive, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "1.824px",
                  color: "#141412",
                }}
              >
                NO-CODE STARTUP HACKATHON
              </span>
            </div>
          </div>
        </div>

        {/* Ground Zone — bottom 50svh: action dock lives here */}
        <div className="hero-ground-zone">
          <div
            className="hero-bottom-area"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 0.7s ${easeCurve} 0.1s, transform 0.7s ${easeCurve} 0.1s`,
            }}
          >
            <HeroActions />
          </div>
        </div>
      </div>

      {/* Log Divider */}
      <div className="hero-log-divider" aria-hidden="true">
        <img
          src="https://www.recursiveacm.in/images/hero/log.png"
          alt=""
          className="hero-log-img"
          loading="eager"
          draggable="false"
        />
      </div>

      {/* Plastic Chair Annotation */}
      <div
        className="hero-chair-annotation"
        style={{
          opacity: isRevealed ? 1 : 0,
          transition: `opacity 0.6s ${easeCurve} 0.12s`,
        }}
      >
        <HeroScrollCue />
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          height: 100vh;
          height: 100dvh;
          width: 100%;
          overflow-x: clip;
          overflow-y: visible;
          background: #e4e9dc;
          z-index: 10;
        }

        .hero-content-flex {
          position: relative;
          z-index: 20;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          height: 100svh;
          min-height: 100vh;
          min-height: 100dvh;
          max-height: 100vh;
          max-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;
          pointer-events: none;
          overflow: hidden;
        }

        .hero-sky-zone {
          position: relative;
          width: 100%;
          height: 50vh;
          height: 50dvh;
          height: 50svh;
          flex: 0 0 50svh;
          max-height: 50svh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-top: clamp(4.2rem, 7svh, 5.5rem);
          padding-bottom: clamp(1.5rem, 3.8svh, 3.2rem);
          padding-inline: clamp(0.75rem, 2vw, 1.5rem);
          box-sizing: border-box;
          pointer-events: none;
        }

        .hero-center-content {
          position: relative;
          width: 100%;
          max-width: 1920px;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: auto;
          will-change: transform, opacity;
          padding-inline: clamp(0.5rem, 1.5vw, 1.2rem);
          flex-shrink: 0;
        }

        .hero-warp-wrap {
          position: relative;
          width: 100%;
          max-width: min(92vw, 1150px);
          height: auto;
          min-height: clamp(80px, 16svh, 180px);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-inline: auto;
        }

        .hero-warp-wrap .warp-text {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-inline: auto;
        }

        .hero-ground-zone {
          position: relative;
          width: 100%;
          height: 50vh;
          height: 50dvh;
          height: 50svh;
          flex: 0 0 50svh;
          max-height: 50svh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-bottom: clamp(2.4rem, 5svh, 4.2rem);
          padding-inline: clamp(0.75rem, 2vw, 1.5rem);
          box-sizing: border-box;
          pointer-events: none;
        }

        .hero-bottom-area {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 25;
          will-change: transform, opacity;
          padding-inline: 1rem;
          pointer-events: auto;
          flex-shrink: 0;
        }

        .hero-log-divider {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          user-select: none;
          z-index: 12;
          overflow: visible;
        }

        .hero-log-img {
          width: 115vw;
          min-width: 100vw;
          max-width: none;
          flex-shrink: 0;
          height: auto;
          aspect-ratio: 2172 / 724;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          image-rendering: -webkit-optimize-contrast;
          filter: drop-shadow(0 14px 20px rgba(10, 24, 12, 0.12));
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .hero-chair-annotation {
          position: absolute;
          left: calc(50% + 64px);
          top: 52%;
          transform: translateY(-50%);
          z-index: 30;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          pointer-events: auto;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .hero-sky-zone {
            padding-top: clamp(4.0rem, 6.8svh, 5.2rem);
            padding-bottom: clamp(1.4rem, 3.6svh, 3.0rem);
          }
          .hero-ground-zone {
            padding-bottom: clamp(2.4rem, 4.8svh, 3.8rem);
          }
          .hero-warp-wrap {
            max-width: min(90vw, 920px);
            height: clamp(115px, min(23svh, 24vw), 250px);
            max-height: 26svh;
          }
        }

        @media (max-width: 860px) {
          .hero-warp-wrap {
            width: 100% !important;
            max-width: min(90vw, 720px) !important;
            height: clamp(110px, min(21svh, 26vw), 215px) !important;
            max-height: 24svh !important;
          }
          .hero-chair-annotation {
            left: calc(50% + 24px);
            top: 53.5%;
            gap: 0.4rem;
          }
          .hero-log-img {
            width: clamp(950px, 130vw, 1500px);
          }
        }

        @media (max-width: 600px) {
          .hero-sky-zone {
            padding-top: clamp(3.8rem, 6.2svh, 4.8rem);
            padding-bottom: clamp(2.2rem, 6.0svh, 3.6rem);
            padding-inline: clamp(0.5rem, 2.5vw, 1rem);
          }
          .hero-ground-zone {
            padding-bottom: clamp(2.2rem, 4.5svh, 3.4rem);
            padding-inline: clamp(0.5rem, 2.5vw, 1rem);
          }
          .hero-warp-wrap {
            width: min(90vw, 420px) !important;
            max-width: min(90vw, 420px) !important;
            height: clamp(105px, min(19svh, 32vw), 160px) !important;
            max-height: 20svh !important;
          }
          .hero-chair-annotation {
            left: calc(50% + 14px);
            right: 10px;
            width: auto;
            max-width: calc(50% - 16px);
            top: 51.5%;
            gap: 0.35rem;
          }
          .hero-log-img {
            width: clamp(720px, 160vw, 1000px);
          }
        }

        @media (max-width: 480px) {
          .hero-warp-wrap {
            width: min(92vw, 370px) !important;
            max-width: min(92vw, 370px) !important;
            height: clamp(100px, min(18svh, 34vw), 150px) !important;
            max-height: 19svh !important;
          }
          .hero-chair-annotation {
            left: calc(50% + 12px);
            right: 8px;
            max-width: calc(50% - 14px);
            gap: 0.28rem;
          }
        }

        @media (max-width: 420px) {
          .hero-sky-zone {
            padding-bottom: clamp(2.4rem, 6.6svh, 4.0rem);
          }
          .hero-warp-wrap {
            width: min(94vw, 345px) !important;
            max-width: min(94vw, 345px) !important;
            height: clamp(95px, min(17.5svh, 35vw), 145px) !important;
            max-height: 18.5svh !important;
          }
          .hero-chair-annotation {
            left: calc(50% + 10px);
            right: 6px;
            max-width: calc(50% - 12px);
            gap: 0.25rem;
          }
        }

        @media (max-height: 560px) {
          .hero-sky-zone {
            height: 52svh !important;
            flex: 0 0 52svh !important;
            padding-top: 3.0rem !important;
            padding-bottom: 0.75rem !important;
          }
          .hero-ground-zone {
            height: 48svh !important;
            flex: 0 0 48svh !important;
            padding-bottom: 1.2rem !important;
          }
          .hero-warp-wrap {
            height: clamp(75px, 20svh, 110px) !important;
          }
        }
      `}</style>
    </section>
  );
};