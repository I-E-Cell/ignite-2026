import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { LiquidMetalButton } from "./LiquidMetalButton";

const lines = [
  { words: ["Welcome", "to", "the", "bottom."] },
  { words: ["Do", "you", "know", "what's", "at", "the", "top?"] },
  { words: ["Yep.", "A", "single", "plastic", "chair."] },
  { words: ["Hundreds", "of", "hackers…", "but", "only", "ONE", "team", "gets", "to", "sit."], accent: "ONE" },
  { words: ["So", "here's", "the", "dare:", "can", "you", "conquer", "it?"] },
  { words: ["Let's", "find", "out."] },
];

const timings: [number, number][] = [
  [4.1, 5.05],
  [5.25, 6.2],
  [6.4, 7.5],
  [7.75, 9.45],
  [9.7, 10.75],
  [10.95, 11.95],
];

export const IntroOverlay: React.FC = () => {
  const [phase, setPhase] = useState<"pending" | "playing" | "done">(() => {
    if (typeof window === "undefined") return "done";
    // Check if previously completed in this session
    try {
      if (sessionStorage.getItem("recursive:intro:v1") === "1") {
        document.documentElement.dataset.intro = "done";
        return "done";
      }
    } catch {
      // ignore
    }
    return "playing";
  });

  const [canSkip, setCanSkip] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const skipWrapRef = useRef<HTMLDivElement>(null);
  const loaderVeilRef = useRef<HTMLDivElement>(null);
  const artifactMarkRef = useRef<HTMLDivElement>(null);
  const welcomeBlockRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hasFinishedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    try {
      sessionStorage.setItem("recursive:intro:v1", "1");
    } catch {
      // ignore
    }

    // Unlock scrolling
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    // Signal completion
    if (typeof document !== "undefined") {
      document.documentElement.dataset.intro = "done";
    }
    window.dispatchEvent(new CustomEvent("recursive-intro-done"));

    // Smoothly fade out root and unmount
    if (rootRef.current) {
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          setPhase("done");
        },
      });
    } else {
      setPhase("done");
    }
  }, []);

  const handleSkip = useCallback(() => {
    if (hasFinishedRef.current) return;

    // Quick bloom flash on skip
    if (tlRef.current) {
      tlRef.current.pause();
    }

    if (bloomRef.current && sceneRef.current) {
      gsap.to(sceneRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" });
      gsap.fromTo(
        bloomRef.current,
        { opacity: 0, scale: 1.05 },
        {
          opacity: 0.9,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(bloomRef.current, {
              opacity: 0,
              duration: 0.5,
              ease: "power1.inOut",
              onComplete: finishIntro,
            });
          },
        }
      );
    } else {
      finishIntro();
    }
  }, [finishIntro]);

  // Handle ESC key for skip
  useEffect(() => {
    if (phase !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, handleSkip]);

  // Allow skip after 1s
  useEffect(() => {
    if (phase !== "playing") return;
    const t = window.setTimeout(() => setCanSkip(true), 1000);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Main Intro GSAP Timeline
  useLayoutEffect(() => {
    if (phase !== "playing" || hasFinishedRef.current) return;

    // Lock body scrolling during intro
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const isDesktop = window.innerWidth >= 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", force3D: true },
        smoothChildTiming: true,
        onComplete: finishIntro,
      });
      tlRef.current = tl;

      // Start video playback
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }

      // Initial state
      if (rootRef.current) gsap.set(rootRef.current, { autoAlpha: 1 });
      if (sceneRef.current) gsap.set(sceneRef.current, { opacity: 1 });

      if (mediaRef.current) {
        gsap.set(mediaRef.current, {
          scale: isDesktop ? 1.07 : 1.12,
          yPercent: isDesktop ? -3.2 : -5,
          transformOrigin: "center center",
          force3D: true,
        });
      }

      // ── Step 1: Veil & Artifact Entrance ──
      const veil = loaderVeilRef.current;
      const artifact = artifactMarkRef.current;
      const welcome = welcomeBlockRef.current;

      if (veil && artifact && welcome) {
        tl.set(veil, { autoAlpha: 1 }, 0);
        tl.set(welcome, { opacity: 0, pointerEvents: "none" }, 0);

        const welcomeWords = Array.from(welcome.querySelectorAll(".intro-welcome-word-i"));
        const welcomeSub = welcome.querySelector(".intro-welcome-sub");

        if (welcomeWords.length > 0) {
          tl.set(welcomeWords, { opacity: 0, y: 18, filter: "blur(8px)" }, 0);
        }
        if (welcomeSub) {
          tl.set(welcomeSub, { opacity: 0, y: 10, letterSpacing: "0.12em" }, 0);
        }

        const artifactImg = artifact.querySelector(".intro-artifact-img");
        const artifactAura = artifact.querySelector(".intro-artifact-aura");

        gsap.set(artifact, { y: 0, opacity: 1, force3D: true });

        if (artifactImg) {
          gsap.set(artifactImg, {
            opacity: 0,
            scaleX: 0.28,
            scaleY: 0.72,
            clipPath: "inset(0% 42% 0% 42%)",
            filter: "brightness(2.2) saturate(1.4) drop-shadow(0 0 32px rgba(162, 235, 98, 0.95))",
            transformOrigin: "center center",
            force3D: true,
          });

          tl.to(
            artifactImg,
            {
              opacity: 1,
              scaleX: 1,
              scaleY: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              filter: "brightness(1.2) saturate(1.15) drop-shadow(0 4px 24px rgba(0, 0, 0, 0.65))",
              duration: 1.05,
              ease: "power3.out",
            },
            0.05
          );
        }

        if (artifactAura) {
          gsap.set(artifactAura, { scale: 0.35, opacity: 0, transformOrigin: "center center", force3D: true });
          tl.to(artifactAura, { scale: 1.25, opacity: 1, duration: 0.65, ease: "power2.out" }, 0.05);
          tl.to(artifactAura, { scale: 1, opacity: 0.8, duration: 0.45, ease: "sine.out" }, 0.7);
        }

        // Lift artifact
        tl.to(artifact, { y: -32, duration: 0.85, ease: "sine.inOut" }, 1.1);
        tl.set(welcome, { opacity: 1, pointerEvents: "auto" }, 1.15);

        if (welcomeWords.length > 0) {
          tl.to(
            welcomeWords,
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.68, ease: "power3.out", stagger: 0.09 },
            1.18
          );
        }

        if (welcomeSub) {
          tl.to(
            welcomeSub,
            { opacity: 1, y: 0, letterSpacing: isDesktop ? "0.34em" : "0.26em", duration: 0.65, ease: "power2.out" },
            1.48
          );
        }

        // Gentle float
        tl.to([artifact, welcome], { y: "-=5", duration: 1.1, ease: "sine.inOut" }, 2.0);

        // Veil exit
        if (welcomeWords.length > 0) {
          tl.to(
            welcomeWords,
            { opacity: 0, y: -14, filter: "blur(6px)", duration: 0.45, ease: "power2.in", stagger: 0.03 },
            3.05
          );
        }
        if (welcomeSub) {
          tl.to(welcomeSub, { opacity: 0, y: -8, duration: 0.4, ease: "power2.in" }, 3.08);
        }
        tl.to(artifact, { opacity: 0, y: "-=12", filter: "blur(8px)", duration: 0.5, ease: "power2.in" }, 3.1);
        tl.to(veil, { autoAlpha: 0, duration: 0.85, ease: "power2.inOut" }, 3.25);
      }

      // ── Step 2: Camera Pull & Progress Bar ──
      if (mediaRef.current) {
        tl.to(mediaRef.current, { scale: 1, yPercent: 0, duration: 8.5, ease: "power1.inOut" }, 3.7);
      }

      if (progressFillRef.current) {
        tl.fromTo(progressFillRef.current, { scaleX: 0 }, { scaleX: 1, duration: 8.2, ease: "none" }, 3.9);
      }

      // ── Step 3: Sequential Captions ──
      lineRefs.current.forEach((lineEl, idx) => {
        if (!lineEl) return;
        const [startT, endT] = timings[idx];
        const words = Array.from(lineEl.querySelectorAll(".intro-word"));

        if (words.length > 0) {
          tl.fromTo(
            words,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.62, ease: "power3.out", stagger: 0.036 },
            startT
          );

          if (idx < lineRefs.current.length - 1) {
            tl.to(words, { opacity: 0, y: -12, duration: 0.34, ease: "power2.in", stagger: 0.018 }, endT);
          } else {
            // Last line fade
            tl.to(
              words,
              { opacity: 0, y: -12, scale: 0.98, duration: 0.58, ease: "power2.inOut", stagger: 0.024 },
              11.9
            );
          }
        }
      });

      // ── Step 4: Skip Button Fade In/Out ──
      if (skipWrapRef.current) {
        tl.fromTo(
          skipWrapRef.current,
          { opacity: 0, y: 10, pointerEvents: "none" },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", pointerEvents: "auto" },
          1.0
        );
        tl.to(skipWrapRef.current, { opacity: 0, y: 8, duration: 0.35, ease: "power2.in", pointerEvents: "none" }, 11.5);
      }

      // ── Step 5: Bloom Handoff & Completion ──
      if (bloomRef.current) {
        tl.fromTo(
          bloomRef.current,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 0.85, ease: "power1.inOut" },
          12.0
        );
      }

      tl.call(() => {
        if (typeof document !== "undefined") {
          document.documentElement.dataset.intro = "done";
        }
        window.dispatchEvent(new CustomEvent("recursive-intro-done"));
      }, undefined, 12.0);

      if (sceneRef.current) {
        tl.to(sceneRef.current, { autoAlpha: 0, duration: 0.85, ease: "power1.inOut" }, 12.3);
      }

      if (bloomRef.current) {
        tl.to(bloomRef.current, { opacity: 0, scale: 1.04, duration: 0.9, ease: "power1.inOut" }, 12.3 + 0.85);
      }
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [phase, finishIntro]);

  if (phase === "done") {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="intro-root"
      role="dialog"
      aria-label="Intro"
      aria-live="polite"
    >
      <div ref={sceneRef} className="intro-scene">
        {/* Background media */}
        <div className="intro-media-clip">
          <div ref={mediaRef} className="intro-media">
            <div ref={focusRef} className="intro-focus">
              <video
                ref={videoRef}
                src="https://www.recursiveacm.in/bg/hero_loop_pp.mp4"
                poster="https://www.recursiveacm.in/images/hero/hero_poster_v3.jpg"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Shaded grade */}
        <div ref={gradeRef} className="intro-grade" aria-hidden="true" />

        {/* Initial Artifact Loader & Welcome Veil */}
        <div ref={loaderVeilRef} className="intro-loader-veil">
          <div className="intro-loader-content">
            <div ref={artifactMarkRef} className="intro-artifact-mark">
              <div className="intro-artifact-aura" aria-hidden="true" />
              <img
                src="https://www.recursiveacm.in/images/ui/artifact.png"
                alt=""
                className="intro-artifact-img"
                draggable={false}
              />
            </div>
            <div ref={welcomeBlockRef} className="intro-welcome-block">
              <h1 className="intro-welcome-title" aria-label="Hi There, Hackers!">
                <span className="intro-welcome-word">
                  <span className="intro-welcome-word-i">Hi</span>
                </span>
                <span className="intro-welcome-word">
                  <span className="intro-welcome-word-i">There,</span>
                </span>
                <span className="intro-welcome-word">
                  <span className="intro-welcome-word-i">Hackers!</span>
                </span>
              </h1>
              <span className="intro-welcome-sub">RECURSIVE 2026</span>
            </div>
          </div>
        </div>

        {/* Sequential Captions */}
        <div className="intro-captions">
          {lines.map((line, a) => (
            <div
              className="intro-line"
              key={a}
              ref={(el) => {
                lineRefs.current[a] = el;
              }}
            >
              <p className="intro-line-text">
                {line.words.map((word, r) => {
                  const isAccent = line.accent === word;
                  return (
                    <span
                      className={`intro-word${isAccent ? " is-accent" : ""}`}
                      key={r}
                    >
                      <span
                        className="intro-word-i"
                        data-accent={isAccent ? "1" : undefined}
                      >
                        {word}
                      </span>
                    </span>
                  );
                })}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Progress Bar */}
        <div className="intro-progress" aria-hidden="true">
          <div ref={progressFillRef} className="intro-progress-fill" />
        </div>

        {/* Skip Button */}
        <div ref={skipWrapRef} className="intro-skip-wrap">
          {canSkip && (
            <LiquidMetalButton
              label="Skip intro"
              onClick={handleSkip}
              width={128}
              height={40}
            />
          )}
        </div>
      </div>

      {/* Bloom flash overlay */}
      <div ref={bloomRef} className="intro-bloom" aria-hidden="true" />

      {/* Embedded Component CSS */}
      <style>{`
        .intro-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          z-index: 9999;
          overflow: hidden;
          background: #0a140c;
          opacity: 1;
          pointer-events: auto;
          -webkit-tap-highlight-color: transparent;
        }

        .intro-scene {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          overflow: hidden;
          background: #0a140c;
          opacity: 1;
          contain: layout paint style;
        }

        .intro-loader-veil {
          position: absolute;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(120% 70% at 50% 0%, rgba(52, 88, 38, 0.48) 0%, rgba(52, 88, 38, 0) 62%),
            linear-gradient(180deg, #0A160A 0%, #010301 65%);
          pointer-events: none;
          overflow: hidden;
          will-change: opacity;
        }

        .intro-loader-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          max-width: 680px;
          padding: 0 1.5rem;
        }

        .intro-artifact-mark {
          position: relative;
          width: clamp(210px, 30vw, 360px);
          aspect-ratio: 744 / 220;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
          will-change: transform, opacity, filter;
        }

        .intro-artifact-aura {
          position: absolute;
          inset: -25% -20%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(143, 196, 90, 0.22) 0%, rgba(76, 133, 46, 0.06) 50%, transparent 72%);
          filter: blur(28px);
          pointer-events: none;
          opacity: 0;
          transform: scale(0.35);
          will-change: transform, opacity;
        }

        .intro-artifact-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0;
          transform: scale(0.28, 0.72);
          clip-path: inset(0% 42% 0% 42%);
          -webkit-clip-path: inset(0% 42% 0% 42%);
          filter: brightness(2.2) saturate(1.4) drop-shadow(0 0 32px rgba(162, 235, 98, 0.95));
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
          will-change: transform, opacity, filter, clip-path;
        }

        .intro-welcome-block {
          position: absolute;
          top: calc(100% + 14px);
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .intro-welcome-title {
          margin: 0;
          font-family: var(--font-display), var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2rem, 5.4vw, 3.6rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: clamp(0.01em, 0.4vw, 0.03em);
          text-transform: none;
          color: #ffffff;
          text-shadow: 0 4px 28px rgba(0, 0, 0, 0.7);
          filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.5));
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3em;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .intro-welcome-title {
            font-size: clamp(1.75rem, 6.8vw, 2.3rem);
            line-height: 1.15;
            padding: 0 0.5rem;
            gap: 0.22em;
          }
        }

        .intro-welcome-word {
          display: inline-block;
        }

        .intro-welcome-word-i {
          display: inline-block;
          will-change: transform, opacity, filter;
        }

        .intro-welcome-sub {
          font-family: var(--font-mono, monospace), monospace;
          font-size: clamp(0.72rem, 1.4vw, 0.86rem);
          font-weight: 600;
          letter-spacing: clamp(0.24em, 0.6vw, 0.34em);
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
          text-shadow: 0 0 16px rgba(120, 185, 75, 0.4);
          margin-top: 10px;
          display: inline-block;
          will-change: transform, opacity, letter-spacing;
        }

        .intro-media-clip {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .intro-media {
          position: absolute;
          inset: 0;
          will-change: transform;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
        }

        .intro-focus {
          position: absolute;
          inset: 0;
        }

        .intro-media video,
        .intro-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .intro-grade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(120% 90% at 50% 116%, rgba(6,14,9,0) 32%, rgba(6,14,9,0.8) 76%, rgba(4,10,7,0.96) 100%),
            linear-gradient(180deg, rgba(6,13,9,0.7) 0%, rgba(6,13,9,0.24) 46%, rgba(6,13,9,0.48) 100%);
        }

        .intro-bloom {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          will-change: opacity, transform;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          background:
            radial-gradient(72% 46% at 50% 74%,
              rgba(255, 244, 214, 0.55) 0%,
              rgba(252, 236, 198, 0.30) 30%,
              rgba(214, 230, 196, 0.08) 58%,
              rgba(214, 230, 196, 0) 78%),
            linear-gradient(0deg, rgba(255, 240, 208, 0.14) 0%, rgba(255, 240, 208, 0) 42%);
        }

        @media (max-width: 860px), (pointer: coarse) {
          .intro-bloom {
            mix-blend-mode: normal !important;
            background: radial-gradient(72% 46% at 50% 74%,
              rgba(255, 244, 214, 0.42) 0%,
              rgba(252, 236, 198, 0.22) 30%,
              rgba(214, 230, 196, 0) 65%) !important;
          }
        }

        .intro-captions {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .intro-line {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 clamp(1.5rem, 6vw, 6rem);
          padding-bottom: clamp(1.5rem, 5vh, 4rem);
        }

        .intro-line-text {
          margin: 0;
          width: 100%;
          max-width: clamp(22ch, 75vw, 36ch);
          text-align: center;
          font-family: var(--font-display), var(--font-dm-sans), sans-serif;
          font-weight: 700;
          font-size: clamp(1.8rem, 4.2vw, 3.6rem);
          line-height: 1.15;
          letter-spacing: -0.025em;
          color: #eef3e8;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
        }

        .intro-word {
          display: inline-block;
          margin: 0 0.24em 0.12em 0;
          opacity: 0;
          will-change: transform, opacity;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
        }

        .intro-word-i {
          display: inline-block;
          transform: translateZ(0);
        }

        .intro-word.is-accent .intro-word-i {
          color: #a6e06a;
          text-shadow: 0 0 16px rgba(143, 196, 90, 0.45);
        }

        @media (max-width: 767px) {
          .intro-line {
            padding: 0 7vw;
            padding-bottom: 2vh;
          }
          .intro-line-text {
            max-width: 20ch;
            font-size: clamp(1.65rem, 5.8vw, 2.3rem);
            line-height: 1.16;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6) !important;
          }
          .intro-word.is-accent .intro-word-i {
            text-shadow: none !important;
          }
        }

        .intro-progress {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          z-index: 1001;
          background: rgba(255, 255, 255, 0.1);
        }

        .intro-progress-fill {
          height: 100%;
          width: 100%;
          transform: scaleX(0);
          transform-origin: left center;
          background: linear-gradient(90deg, #5c8c3a, #a6e06a);
        }

        .intro-skip-wrap {
          position: absolute;
          right: clamp(1.2rem, 3vw, 2.8rem);
          bottom: clamp(1.2rem, 3.5vh, 2.8rem);
          z-index: 1002;
          opacity: 0;
          pointer-events: none;
          will-change: opacity, transform;
        }

        @media (min-width: 1025px) {
          .intro-skip-wrap {
            right: clamp(2rem, 3.5vw, 3.5rem);
            bottom: clamp(2rem, 4vh, 3.5rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-root { display: none; }
        }
      `}</style>
    </div>
  );
};
