import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (typeof window === "undefined") return null;

  // Respect prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  if (!lenisInstance) {
    lenisInstance = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });

    // Synchronize Lenis scroll updates with GSAP ScrollTrigger
    lenisInstance.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Drive Lenis directly via GSAP's internal ticker for locked 60/120fps sync
    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000);
    });

    // Disable lag smoothing to prevent animation jump during rapid scrolls
    gsap.ticker.lagSmoothing(0);

    // Global anchor click handler for smooth scrolling
    document.addEventListener("click", (e) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenisInstance?.scrollTo(el as HTMLElement, {
            offset: -20,
            duration: 1.2,
          });
          window.history.pushState(null, "", href);
        }
      }
    });
  }

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
