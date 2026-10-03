import { useEffect, useRef, useState, useCallback } from "react";

export const HeroMedia = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback: resume on first user interaction
        const onInteraction = () => {
          video.play().catch(() => {});
          window.removeEventListener("pointerdown", onInteraction);
          window.removeEventListener("scroll", onInteraction);
          window.removeEventListener("touchstart", onInteraction);
        };
        window.addEventListener("pointerdown", onInteraction, { once: true, passive: true });
        window.addEventListener("scroll", onInteraction, { once: true, passive: true });
        window.addEventListener("touchstart", onInteraction, { once: true, passive: true });
      });
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if intro overlay is currently active
    const isIntroPlaying =
      typeof document !== "undefined" &&
      document.documentElement.dataset.intro === "playing";

    if (!isIntroPlaying) {
      attemptPlay();
    }

    // Coordinated handoff from intro overlay
    const onIntroDone = (e: Event) => {
      const customEvent = e as CustomEvent<{ currentTime?: number }>;
      if (video) {
        if (
          customEvent.detail &&
          typeof customEvent.detail.currentTime === "number" &&
          customEvent.detail.currentTime > 0
        ) {
          try {
            video.currentTime = customEvent.detail.currentTime;
          } catch {
            // Ignore seek errors
          }
        }
        attemptPlay();
      }
    };

    window.addEventListener("recursive-intro-done", onIntroDone);

    // Pause video when hero scrolls out of view for max performance (60fps smooth scrolling)
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (document.visibilityState === "visible") {
                attemptPlay();
              }
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    // Tab visibility handling
    const onVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        const isVisible =
          !observer ||
          (containerRef.current &&
            containerRef.current.getBoundingClientRect().bottom > 0);
        if (isVisible) {
          attemptPlay();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("recursive-intro-done", onIntroDone);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (observer) observer.disconnect();
    };
  }, [attemptPlay]);

  return (
    <div ref={containerRef} className="hero-video-wrap">
      {/* High-res poster preloaded for instant initial frame */}
      <img
        src="https://www.recursiveacm.in/images/hero/hero_poster_v3.jpg"
        alt="The Chair on the Hill"
        aria-hidden="true"
        draggable="false"
        decoding="async"
        className="hero-video hero-poster"
      />

      {/* Seamless cross-fading loop video */}
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
        onPlaying={() => setIsVideoActive(true)}
        className={`hero-video hero-stream ${isVideoActive ? "hero-stream-active" : ""}`}
      />

      <style>{`
        .hero-video-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
          background-color: #0b150d;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          pointer-events: none;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .hero-poster {
          z-index: 1;
        }

        .hero-stream {
          z-index: 2;
          opacity: 0;
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: opacity;
        }

        .hero-stream.hero-stream-active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};