import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export interface CrowdCanvasProps {
  src?: string;
  rows?: number;
  cols?: number;
}

interface Peep {
  image: HTMLImageElement;
  rect: number[];
  width: number;
  height: number;
  drawArgs: (HTMLImageElement | number)[];
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  scaleY: number;
  walk: gsap.core.Timeline | null;
  setRect: (rect: number[]) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export const CrowdCanvas: React.FC<CrowdCanvasProps> = ({
  src = "https://www.recursiveacm.in/images/peeps/all-peeps.png",
  rows = 15,
  cols = 7,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const randInt = (arr: unknown[]) => Math.floor(rand(0, arr.length));
    const removeRandom = <T,>(arr: T[], idx: number): T => arr.splice(idx, 1)[0];

    const stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const activePeeps: Peep[] = [];

    const getScale = (peepHeight: number) => {
      const targetFactor =
        stage.width < 620 ? 0.48 : stage.width < 1024 ? 0.44 : 0.42;
      return Math.min(1, Math.max(0.18, (stage.height * targetFactor) / peepHeight));
    };

    const createPeep = (image: HTMLImageElement, rect: number[]): Peep => {
      const p: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        scaleY: 1,
        walk: null,
        setRect: (r: number[]) => {
          p.rect = r;
          p.width = r[2];
          p.height = r[3];
          p.drawArgs = [p.image, ...r, 0, 0, p.width, p.height];
        },
        render: (c: CanvasRenderingContext2D) => {
          c.save();
          c.translate(p.x, p.y);
          c.scale(p.scaleX, p.scaleY);
          c.drawImage(
            p.image,
            p.rect[0],
            p.rect[1],
            p.rect[2],
            p.rect[3],
            0,
            0,
            p.width,
            p.height
          );
          c.restore();
        },
      };
      p.setRect(rect);
      return p;
    };

    const recyclePeep = (peep: Peep) => {
      const idx = activePeeps.indexOf(peep);
      if (idx !== -1) {
        removeRandom(activePeeps, idx);
      }
      availablePeeps.push(peep);
    };

    const spawnPeep = (): Peep => {
      const peep = removeRandom(availablePeeps, randInt(availablePeeps));
      const dir = Math.random() > 0.5 ? 1 : -1;
      const scale = getScale(peep.height);

      const yOffset =
        stage.width < 620
          ? (-2 - 18 * gsap.parseEase("power2.in")(Math.random())) * scale
          : (10 - 45 * gsap.parseEase("power2.in")(Math.random())) * scale;

      const groundY = stage.height - peep.height * scale + yOffset;
      let startX: number;
      let endX: number;

      if (dir === 1) {
        startX = -peep.width * scale;
        endX = stage.width;
        peep.scaleX = scale;
      } else {
        startX = stage.width + peep.width * scale;
        endX = 0;
        peep.scaleX = -scale;
      }

      peep.scaleY = scale;
      peep.x = startX;
      peep.y = groundY;
      peep.anchorY = groundY;

      const tl = gsap.timeline();
      tl.timeScale(rand(0.5, 1.5));
      tl.to(peep, { duration: 10, x: endX, ease: "none" }, 0);
      tl.to(peep, { duration: 0.25, repeat: 40, yoyo: true, y: groundY - 10 }, 0);

      tl.eventCallback("onComplete", () => {
        recyclePeep(peep);
        spawnPeep();
      });

      peep.walk = tl;
      activePeeps.push(peep);
      activePeeps.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const getPixelRatio = () =>
      Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const dpr = getPixelRatio();
      ctx.scale(dpr, dpr);
      activePeeps.forEach((peep) => peep.render(ctx));
      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = getPixelRatio();
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      activePeeps.forEach((peep) => peep.walk?.kill());
      activePeeps.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      const first = allPeeps[0];
      const peepW = first ? first.width * getScale(first.height) : 120;
      const count = Math.min(
        allPeeps.length,
        Math.max(
          stage.width < 620 ? 38 : 28,
          Math.round((14 * stage.width) / peepW)
        )
      );

      while (availablePeeps.length && activePeeps.length < count) {
        spawnPeep().walk?.progress(Math.random());
      }
    };

    let isRunning = false;
    const startAnimation = () => {
      if (!isRunning) {
        isRunning = true;
        gsap.ticker.add(render);
      }
    };

    const stopAnimation = () => {
      if (isRunning) {
        isRunning = false;
        gsap.ticker.remove(render);
      }
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const cellW = img.naturalWidth / rows;
      const cellH = img.naturalHeight / cols;
      const total = rows * cols;
      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep(img, [
            (i % rows) * cellW,
            Math.floor(i / rows) * cellH,
            cellW,
            cellH,
          ])
        );
      }
      resize();
      startAnimation();
    };
    img.src = src;

    window.addEventListener("resize", resize);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              startAnimation();
            } else {
              stopAnimation();
            }
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(canvas);
    }

    return () => {
      window.removeEventListener("resize", resize);
      observer?.disconnect();
      stopAnimation();
      activePeeps.forEach((peep) => peep.walk?.kill());
    };
  }, [src, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 h-full w-full pointer-events-none z-20"
    />
  );
};
