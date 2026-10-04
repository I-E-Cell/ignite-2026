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
        {/* Sky Zone — top area: logo lockup lives here */}
        <div className="hero-sky-zone">
          <div
            id="headingrow"
            className="hero-center-content hero-brand-lockup"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 0.7s ${easeCurve} 0.02s, transform 0.7s ${easeCurve} 0.02s`,
            }}
          >
            <h1 className="sr-only">IGNITE 2026 — No-Code Startup Hackathon by I&amp;E Cell</h1>
            {/* Monumental IGNITE Brand Title */}
            <div className="hero-wordmark-wrap" role="heading" aria-level={2} aria-label="IGNITE">
              <span className="hero-wordmark-title">
                IGNITE
              </span>
            </div>

            {/* NO-CODE STARTUP HACKATHON Subtitle */}
            <div className="hero-tagline-wrap">
              <span className="hero-tagline-title">
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
          src="/images/hero/log.png"
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
          height: 44vh;
          height: 44dvh;
          height: 44svh;
          flex: 0 0 44svh;
          max-height: 44svh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-top: clamp(4.2rem, 7vh, 5.5rem);
          padding-bottom: clamp(0.75rem, 2vh, 1.6rem);
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
          justify-content: flex-end;
          text-align: center;
          pointer-events: auto;
          will-change: transform, opacity;
          padding-inline: clamp(0.5rem, 1.5vw, 1.2rem);
          flex-shrink: 0;
        }

        .hero-brand-lockup {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 0;
          margin: 0 auto;
        }

        .hero-wordmark-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: auto;
          max-width: 100%;
          margin: 0;
          padding: 0;
          line-height: 0.82;
        }

        .hero-wordmark-title {
          font-family: var(--font-headingNow), 'Plus Jakarta Sans', 'Geist', sans-serif;
          font-weight: 800;
          font-size: clamp(3.6rem, 11.5vw, 300px);
          line-height: 0.84;
          letter-spacing: -0.035em;
          text-transform: uppercase;
          color: #141412;
          user-select: none;
          margin: 0;
          padding: 0;
          filter: drop-shadow(0 4px 18px rgba(20, 20, 18, 0.12));
        }

        .hero-tagline-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: clamp(6px, 1.2vh, 12px);
          padding: 0;
        }

        .hero-tagline-title {
          font-family: var(--font-headingNow), 'Plus Jakarta Sans', 'Geist', sans-serif;
          font-weight: 700;
          font-size: clamp(0.95rem, 2vw, 22px);
          line-height: 1.2;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #141412;
          user-select: none;
        }

        .hero-ground-zone {
          position: relative;
          width: 100%;
          height: 56vh;
          height: 56dvh;
          height: 56svh;
          flex: 1 1 56svh;
          max-height: 56svh;
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
            height: 44svh;
            flex: 0 0 44svh;
            padding-top: clamp(4.0rem, 7vh, 5.2rem);
            padding-bottom: clamp(0.5rem, 1.5vh, 1.2rem);
          }
          .hero-ground-zone {
            padding-bottom: clamp(2.4rem, 4.8svh, 3.8rem);
          }
        }

        @media (max-width: 860px) {
          .hero-sky-zone {
            height: 43svh;
            flex: 0 0 43svh;
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
            height: 42svh;
            flex: 0 0 42svh;
            padding-top: clamp(3.8rem, 6.5svh, 4.8rem);
            padding-bottom: 0.4rem;
            padding-inline: clamp(0.5rem, 2.5vw, 1rem);
          }
          .hero-ground-zone {
            padding-bottom: clamp(2.0rem, 4.2svh, 3.2rem);
            padding-inline: clamp(0.5rem, 2.5vw, 1rem);
          }
          .hero-wordmark-title {
            font-size: clamp(3rem, 13.5vw, 68px);
          }
          .hero-tagline-title {
            font-size: clamp(0.85rem, 3.6vw, 15px);
            letter-spacing: 1.2px;
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
          .hero-chair-annotation {
            left: calc(50% + 12px);
            right: 8px;
            max-width: calc(50% - 14px);
            gap: 0.28rem;
          }
        }

        @media (max-width: 420px) {
          .hero-chair-annotation {
            left: calc(50% + 10px);
            right: 6px;
            max-width: calc(50% - 12px);
            gap: 0.25rem;
          }
        }

        @media (max-height: 560px) {
          .hero-sky-zone {
            height: 50svh !important;
            flex: 0 0 50svh !important;
            padding-top: 2.8rem !important;
            padding-bottom: 0.5rem !important;
          }
          .hero-ground-zone {
            height: 50svh !important;
            flex: 0 0 50svh !important;
            padding-bottom: 1.0rem !important;
          }
        }
      `}</style>
    </section>
  );
};