import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { LiquidMetalButton } from "./LiquidMetalButton";

const lines = [
  { words: ["It's", "not", "a", "weekend", "hackathon."] },
  { words: ["It's", "a", "startup,", "built", "over", "20", "weeks."] },
  { words: ["No", "code", "required.", "Just", "pure", "conviction."], accent: "conviction" },
  { words: ["Let's", "IGNITE."] },
];

const timings: [number, number][] = [
  [3.1, 4.05],
  [4.25, 5.25],
  [5.45, 6.55],
  [6.75, 7.5],
];

// In-memory flag so navigating between routes in the single-page app doesn't re-trigger intro,
// but refreshing or reloading the browser starts fresh every single time.
let hasIntroPlayedInSpa = false;

export const IntroOverlay: React.FC = () => {
  const [phase, setPhase] = useState<"pending" | "playing" | "done">(() => {
    if (typeof window === "undefined") return "done";
    // Clean up any legacy persistent session storage keys
    try {
      sessionStorage.removeItem("recursive:intro:v1");
      sessionStorage.removeItem("recursive:skip-intro-for-anchor");
    } catch {
      // ignore
    }

    try {
      const search = window.location.search;
      if (search.includes("intro=0")) {
        document.documentElement.dataset.intro = "done";
        return "done";
      }
      if (search.includes("intro=replay") || search.includes("intro=test") || search.includes("intro=1")) {
        hasIntroPlayedInSpa = false;
        document.documentElement.dataset.intro = "playing";
        return "playing";
      }
    } catch {
      // ignore
    }

    // If intro has already played during this active SPA navigation session
    if (hasIntroPlayedInSpa) {
      document.documentElement.dataset.intro = "done";
      return "done";
    }

    document.documentElement.dataset.intro = "playing";
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
    hasIntroPlayedInSpa = true;

    try {
      sessionStorage.removeItem("recursive:intro:v1");
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
    const currentTime = videoRef.current ? videoRef.current.currentTime : 0;
    window.dispatchEvent(new CustomEvent("recursive-intro-done", { detail: { currentTime } }));

    // Smoothly fade out root and unmount
    if (rootRef.current) {
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.5,
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

  // Allow skip after 500ms
  useEffect(() => {
    if (phase !== "playing") return;
    const t = window.setTimeout(() => setCanSkip(true), 500);
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
        videoRef.current.play().catch(() => { });
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
        tl.set(artifact, { opacity: 0, scale: 0.9, y: 14 }, 0);
        tl.set(welcome, { opacity: 1, pointerEvents: "auto" }, 0);

        const kicker = welcome.querySelector(".intro-welcome-kicker");
        const welcomeWords = Array.from(welcome.querySelectorAll(".intro-welcome-word-i"));
        const welcomeSub = welcome.querySelector(".intro-welcome-sub-wrap");

        if (kicker) tl.set(kicker, { opacity: 0, y: 8 }, 0);
        if (welcomeWords.length > 0) {
          tl.set(welcomeWords, { opacity: 0, y: 18, filter: "blur(8px)" }, 0);
        }
        if (welcomeSub) {
          tl.set(welcomeSub, { opacity: 0, y: 10 }, 0);
        }

        // 1. E-Cell logo badge smoothly emerges
        tl.to(
          artifact,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          0.12
        );

        // 2. Kicker reveals
        if (kicker) {
          tl.to(kicker, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.3);
        }

        // 3. Staggered words "Hi There, Founders!"
        if (welcomeWords.length > 0) {
          tl.to(
            welcomeWords,
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out", stagger: 0.06 },
            0.45
          );
        }

        // 4. Subtitle tag settles in
        if (welcomeSub) {
          tl.to(
            welcomeSub,
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            0.7
          );
        }

        // 5. Subtle upward breath
        tl.to([artifact, welcome], { y: -8, duration: 0.9, ease: "sine.inOut" }, 1.7);

        // 6. Smooth cinematic dissolve out
        if (welcomeWords.length > 0) {
          tl.to(
            welcomeWords,
            { opacity: 0, y: -12, filter: "blur(5px)", duration: 0.28, ease: "power2.in", stagger: 0.02 },
            2.52
          );
        }
        if (kicker) {
          tl.to(kicker, { opacity: 0, y: -8, duration: 0.2, ease: "power2.in" }, 2.54);
        }
        if (welcomeSub) {
          tl.to(welcomeSub, { opacity: 0, y: -6, duration: 0.22, ease: "power2.in" }, 2.56);
        }
        tl.to(artifact, { opacity: 0, scale: 0.96, y: -12, filter: "blur(6px)", duration: 0.3, ease: "power2.in" }, 2.58);
        tl.to(veil, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, 2.72);
      }

      // ── Step 2: Camera Pull & Progress Bar ──
      if (mediaRef.current) {
        tl.to(mediaRef.current, { scale: 1, yPercent: 0, duration: 4.7, ease: "power1.inOut" }, 2.8);
      }

      if (progressFillRef.current) {
        tl.fromTo(progressFillRef.current, { scaleX: 0 }, { scaleX: 1, duration: 4.5, ease: "none" }, 3.0);
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
            { opacity: 1, y: 0, duration: 0.38, ease: "power3.out", stagger: 0.025 },
            startT
          );

          if (idx < lineRefs.current.length - 1) {
            tl.to(words, { opacity: 0, y: -10, duration: 0.22, ease: "power2.in", stagger: 0.015 }, endT);
          } else {
            // Last line fade
            tl.to(
              words,
              { opacity: 0, y: -10, scale: 0.98, duration: 0.35, ease: "power2.inOut", stagger: 0.02 },
              endT
            );
          }
        }
      });

      // ── Step 4: Skip Button Fade In/Out ──
      if (skipWrapRef.current) {
        tl.fromTo(
          skipWrapRef.current,
          { opacity: 0, y: 10, pointerEvents: "none" },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", pointerEvents: "auto" },
          0.5
        );
        tl.to(skipWrapRef.current, { opacity: 0, y: 8, duration: 0.25, ease: "power2.in", pointerEvents: "none" }, 7.1);
      }

      // ── Step 5: Bloom Handoff & Completion ──
      if (bloomRef.current) {
        tl.fromTo(
          bloomRef.current,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "power1.inOut" },
          7.5
        );
      }

      tl.call(() => {
        if (typeof document !== "undefined") {
          document.documentElement.dataset.intro = "done";
        }
        window.dispatchEvent(new CustomEvent("recursive-intro-done"));
      }, undefined, 7.5);

      if (sceneRef.current) {
        tl.to(sceneRef.current, { autoAlpha: 0, duration: 0.45, ease: "power1.inOut" }, 7.65);
      }

      if (bloomRef.current) {
        tl.to(bloomRef.current, { opacity: 0, scale: 1.04, duration: 0.55, ease: "power1.inOut" }, 8.1);
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
              <img
                src="/images/hero/hero_poster_v3.jpg"
                alt=""
                aria-hidden="true"
                draggable={false}
                decoding="async"
                className="intro-media-poster"
              />
              <video
                ref={videoRef}
                src="/videos/hero_loop.mp4"
                poster="/images/hero/hero_poster_v3.jpg"
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
            {/* E-Cell Brand Mark (Clean, Unboxed) */}
            <div ref={artifactMarkRef} className="intro-artifact-mark" aria-label="E-Cell AIT Pune">
              <div className="intro-brand-aura" aria-hidden="true" />
              <svg
                viewBox="0 0 92 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="intro-ecell-logo"
                aria-hidden="true"
              >
                <path
                  d="M5.77161 12.4823C6.05944 12.7382 6.51417 12.7255 6.78729 12.4539C7.06041 12.1824 7.04849 11.7549 6.76066 11.499L6.26614 11.9906L5.77161 12.4823ZM4.30409 9.31499C4.01627 9.05911 3.56153 9.07179 3.28842 9.34332C3.0153 9.61485 3.02722 10.0424 3.31505 10.2983L3.80957 9.80664L4.30409 9.31499ZM6.26614 11.9906L6.76066 11.499L4.30409 9.31499L3.80957 9.80664L3.31505 10.2983L5.77161 12.4823L6.26614 11.9906Z"
                  fill="currentColor"
                />
                <path
                  d="M13.7596 9.98958C13.7586 10.3747 14.07 10.6876 14.4552 10.6884C14.8403 10.6893 15.1533 10.3778 15.1542 9.99265L14.4569 9.99111L13.7596 9.98958ZM15.1622 6.81404C15.1631 6.42891 14.8517 6.11602 14.4666 6.11517C14.0815 6.11432 13.7685 6.42584 13.7675 6.81096L14.4648 6.8125L15.1622 6.81404ZM14.4569 9.99111L15.1542 9.99265L15.1622 6.81404L14.4648 6.8125L13.7675 6.81096L13.7596 9.98958L14.4569 9.99111Z"
                  fill="currentColor"
                />
                <path
                  d="M24.9788 10.4402C25.245 10.1619 25.2224 9.73469 24.9283 9.48605C24.6342 9.23741 24.1799 9.26146 23.9137 9.53977L24.4463 9.98997L24.9788 10.4402ZM21.653 11.9033C21.3868 12.1816 21.4094 12.6088 21.7035 12.8574C21.9976 13.1061 22.4519 13.082 22.7181 12.8037L22.1855 12.3535L21.653 11.9033ZM24.4463 9.98997L23.9137 9.53977L21.653 11.9033L22.1855 12.3535L22.7181 12.8037L24.9788 10.4402L24.4463 9.98997Z"
                  fill="currentColor"
                />
                <path
                  d="M53.4668 3.58789C60.6918 1.32369 71.7632 -1.72536 82.2344 7.41992C85.3552 10.3239 89.0797 15.5075 90.1602 21.5732C91.2248 27.5512 89.7523 34.5272 82.2344 41.2461C81.0641 42.292 78.9185 43.2891 75.8506 44.0879C72.8185 44.8774 69.0169 45.4407 64.6621 45.7061C55.954 46.2366 45.1353 45.5719 34.0332 43.2324L34.0078 43.2266L33.9814 43.2227L33.4688 43.1328C30.8308 42.6466 27.0917 41.6036 23.8809 39.958C20.4104 38.1793 17.9658 35.9128 17.6162 33.2412C17.6307 32.6077 17.8708 31.7374 18.4209 30.6338C18.98 29.5122 19.8138 28.2361 20.8916 26.8506C23.0464 24.0806 26.1056 20.9663 29.6738 17.9033C36.829 11.7614 45.8612 5.97132 53.4668 3.58789Z"
                  stroke="currentColor"
                  strokeWidth="2.44066"
                  fill="none"
                />
                <path
                  d="M10.8438 32.2422H14.2248V33.1504H13.0173V34.0585H14.2248V35.1938H10.8438V34.0585H13.0173V33.1504L10.8438 33.1837V32.2422Z"
                  fill="currentColor"
                />
                <path
                  d="M14.2248 36.1019H10.8438C11.037 36.8285 11.5683 37.1615 11.8098 37.2372H14.2248V36.1019Z"
                  fill="currentColor"
                />
                <path
                  d="M15.4727 31.1182H10.4012C10.4012 28.757 9.43521 27.0314 8.7107 26.5774C5.0399 23.8528 5.5712 19.0849 6.2957 17.0415C8.4209 11.5924 14.5872 11.8951 17.4047 12.7276C22.437 14.2145 23.6445 19.7542 23.2007 21.5824C22.6635 23.7959 19.8197 27.2585 18.3707 28.1667C16.3917 29.407 16.2777 29.983 15.4727 31.1182Z"
                  fill="currentColor"
                />
                <path
                  d="M4.07827 19.7539H0.697266"
                  stroke="currentColor"
                  strokeWidth="1.39466"
                  strokeLinecap="round"
                />
                <path
                  d="M28.4213 19.977C28.8061 19.9618 29.1041 19.6376 29.0869 19.2528C29.0696 18.8681 28.7437 18.5685 28.3589 18.5838L28.3901 19.2804L28.4213 19.977ZM24.9805 18.7174C24.5957 18.7327 24.2977 19.0569 24.3149 19.4416C24.3322 19.8264 24.6581 20.1259 25.0429 20.1107L25.0117 19.4141L24.9805 18.7174ZM28.3901 19.2804L28.3589 18.5838L24.9805 18.7174L25.0117 19.4141L25.0429 20.1107L28.4213 19.977L28.3901 19.2804Z"
                  fill="currentColor"
                />
                <path
                  d="M14.4345 24.9277C13.396 24.9277 12.4738 24.7205 11.668 24.3063C10.8622 23.8863 10.2294 23.2961 9.76974 22.5357C9.31007 21.7696 9.08024 20.8644 9.08024 19.8202C9.08024 18.7874 9.28737 17.8794 9.70164 17.0963C10.1216 16.3132 10.7146 15.7031 11.4807 15.2661C12.2525 14.8235 13.169 14.6022 14.2302 14.6022C14.8034 14.6022 15.3567 14.7043 15.8901 14.9086C16.4292 15.1129 16.9116 15.4023 17.3372 15.7769C17.7685 16.1514 18.109 16.5969 18.3587 17.1133C18.6141 17.6297 18.7417 18.2001 18.7417 18.8243C18.7417 19.108 18.6822 19.3123 18.563 19.4372C18.4438 19.5564 18.2792 19.6358 18.0693 19.6755C17.8593 19.7153 17.6181 19.7493 17.3457 19.7777L10.8934 19.9564C10.8934 20.6999 11.0523 21.3269 11.3701 21.8377C11.6879 22.3427 12.1191 22.7258 12.6639 22.9868C13.2087 23.2422 13.8216 23.3699 14.5026 23.3699C14.985 23.3699 15.3936 23.3075 15.7284 23.1826C16.0632 23.0578 16.3583 22.896 16.6137 22.6974C16.8747 22.4931 17.1301 22.2746 17.3798 22.042C17.5557 21.8944 17.743 21.8206 17.9416 21.8206C18.1743 21.8206 18.3672 21.8916 18.5204 22.0335C18.6793 22.1697 18.7588 22.3541 18.7588 22.5868C18.7588 22.95 18.6084 23.2763 18.3076 23.5657C18.0125 23.8551 17.638 24.102 17.184 24.3063C16.73 24.5049 16.2561 24.6581 15.7624 24.7659C15.2687 24.8737 14.8261 24.9277 14.4345 24.9277ZM10.8593 18.7562L15.9752 18.6455C16.1341 18.6342 16.2788 18.603 16.4094 18.5519C16.5399 18.5008 16.6051 18.41 16.6051 18.2795C16.6051 17.7347 16.4888 17.3006 16.2561 16.9771C16.0291 16.648 15.7341 16.4125 15.3709 16.2706C15.0077 16.1231 14.6274 16.0493 14.2302 16.0493C13.2257 16.0493 12.4313 16.2961 11.8468 16.7899C11.2622 17.2779 10.9331 17.9333 10.8593 18.7562Z"
                  fill="#8FC45A"
                />
                <text
                  x="58"
                  y="27.5"
                  textAnchor="middle"
                  fill="currentColor"
                  style={{
                    fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif",
                    fontWeight: 900,
                    fontSize: "14px",
                    letterSpacing: "0.06em",
                  }}
                >
                  E.CELL
                </text>
                <text
                  x="65"
                  y="37.5"
                  textAnchor="middle"
                  fill="currentColor"
                  style={{
                    fontFamily: "var(--font-headingNow), 'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "6.8px",
                    letterSpacing: "0.14em",
                  }}
                >
                  AIT PUNE
                </text>
              </svg>
            </div>

            {/* Welcome Lockup */}
            <div ref={welcomeBlockRef} className="intro-welcome-block">
              <div className="intro-welcome-kicker">
                <span className="intro-kicker-dot" />
                <span>INNOVATION &amp; ENTREPRENEURSHIP CELL PRESENTS</span>
              </div>

              <h1 className="intro-welcome-title" aria-label="Hi There, Founders!">
                <span className="intro-welcome-word">
                  <span className="intro-welcome-word-i text-[#FBFAF8]">Hi</span>
                </span>
                <span className="intro-welcome-word">
                  <span className="intro-welcome-word-i text-[#FBFAF8]">There,</span>
                </span>
                <span className="intro-welcome-word">
                  <span className="intro-welcome-word-i intro-founders-highlight">Founders!</span>
                </span>
              </h1>

              <div className="intro-welcome-sub-wrap">
                <span className="intro-welcome-sub">
                  IGNITE 2026 <span className="intro-sub-bullet">·</span> NO-CODE STARTUP COHORT
                </span>
              </div>
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
          background: radial-gradient(circle at 50% 50%, #000000 0%, #000000 40%, #1A3413 65%, #0B1909 85%, #000000 100%);
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
          max-width: 760px;
          padding: 0 1.5rem;
        }

        .intro-artifact-mark {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
          will-change: transform, opacity, filter;
          margin-bottom: clamp(1rem, 2.5vh, 1.75rem);
        }

        .intro-brand-aura {
          display: none;
        }

        .intro-ecell-logo {
          position: relative;
          z-index: 2;
          height: clamp(38px, 6vh, 48px);
          width: auto;
          display: block;
          color: #FBFAF8;
          filter: drop-shadow(0 2px 14px rgba(143, 196, 90, 0.4));
        }

        .intro-welcome-block {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .intro-welcome-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace;
          font-size: clamp(0.66rem, 1.25vw, 0.78rem);
          font-weight: 600;
          letter-spacing: clamp(0.18em, 0.4vw, 0.26em);
          text-transform: uppercase;
          color: #A8A69B;
          margin-bottom: 0.75rem;
        }

        .intro-kicker-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #8FC45A;
          box-shadow: 0 0 8px #8FC45A;
          flex-shrink: 0;
        }

        .intro-welcome-title {
          margin: 0;
          font-family: var(--font-headingNow), 'Plus Jakarta Sans', var(--font-display), sans-serif;
          font-size: clamp(2.35rem, 6.2vw, 4.2rem);
          font-weight: 850;
          line-height: 1.08;
          letter-spacing: -0.03em;
          text-transform: none;
          color: #FBFAF8;
          text-shadow: 0 4px 28px rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3em;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .intro-welcome-title {
            font-size: clamp(1.85rem, 7.6vw, 2.5rem);
            line-height: 1.12;
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

        .intro-founders-highlight {
          background: linear-gradient(135deg, #CEF585 0%, #8FC45A 45%, #5C8C3A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 24px rgba(143, 196, 90, 0.45));
          display: inline-block;
        }

        .intro-welcome-sub-wrap {
          margin-top: clamp(0.85rem, 2vh, 1.25rem);
          display: flex;
          justify-content: center;
        }

        .intro-welcome-sub {
          font-family: var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace;
          font-size: clamp(0.7rem, 1.3vw, 0.82rem);
          font-weight: 600;
          letter-spacing: clamp(0.18em, 0.4vw, 0.26em);
          text-transform: uppercase;
          color: rgba(251, 250, 248, 0.8);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 4px;
          padding: 0.35rem 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .intro-sub-bullet {
          color: #8FC45A;
        }

        .intro-media-clip {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background-color: #0b150d;
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

        .intro-media-poster {
          z-index: 1;
        }

        .intro-focus video {
          z-index: 2;
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
