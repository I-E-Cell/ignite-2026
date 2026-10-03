import React, { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  alpha: number;
}

interface LightningBolt {
  segments: Segment[];
  startTime: number;
  duration: number; // in ms
  maxAlpha: number;
  color: string;
  glowColor: string;
  isForked: boolean;
}

interface SheetFlash {
  x: number;
  y: number;
  radius: number;
  startTime: number;
  duration: number;
  intensity: number;
  color: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface ThunderBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  enableClickStrikes?: boolean;
  enableMouseSparks?: boolean;
  minInterval?: number; // ms between ambient strikes
  maxInterval?: number;
}

export const ThunderBackground: React.FC<ThunderBackgroundProps> = ({
  className = "",
  style = {},
  enableClickStrikes = true,
  enableMouseSparks = true,
  minInterval = 3500,
  maxInterval = 7000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const bolts: LightningBolt[] = [];
    const flashes: SheetFlash[] = [];
    const sparks: Spark[] = [];

    let isTabVisible = true;
    let nextStrikeTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastMousePos: Point | null = null;
    let mouseThrottle = 0;

    // Handle HiDPI displays
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Visibility listener
    const onVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
      if (!isTabVisible && nextStrikeTimeout) {
        clearTimeout(nextStrikeTimeout);
        nextStrikeTimeout = null;
      } else if (isTabVisible && !nextStrikeTimeout) {
        scheduleNextStrike();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // --- PROCEDURAL LIGHTNING GENERATOR ---
    const generateBranch = (
      start: Point,
      end: Point,
      depth: number,
      segments: Segment[],
      branchProb: number,
      thickness: number
    ) => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base case: small enough segment
      if (dist < 18 || depth > 6) {
        segments.push({
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          width: Math.max(thickness, 0.75),
          alpha: 1.0,
        });
        return;
      }

      // Midpoint displacement with normal perpendicular jitter
      const midFactor = 0.45 + Math.random() * 0.1;
      const midX = start.x + dx * midFactor;
      const midY = start.y + dy * midFactor;

      const perpX = -dy / dist;
      const perpY = dx / dist;
      const displacement = (Math.random() - 0.5) * dist * 0.42;

      const displacedMid: Point = {
        x: midX + perpX * displacement,
        y: midY + perpY * displacement,
      };

      // Recurse first half
      generateBranch(
        start,
        displacedMid,
        depth + 1,
        segments,
        branchProb,
        thickness * 0.95
      );

      // Branch out occasionally
      if (depth >= 1 && depth <= 4 && Math.random() < branchProb) {
        const branchLength = dist * (0.35 + Math.random() * 0.35);
        const branchAngle =
          Math.atan2(dy, dx) + (Math.random() - 0.5) * (Math.PI / 2.2);

        const branchEnd: Point = {
          x: displacedMid.x + Math.cos(branchAngle) * branchLength,
          y: displacedMid.y + Math.sin(branchAngle) * branchLength,
        };

        generateBranch(
          displacedMid,
          branchEnd,
          depth + 2,
          segments,
          branchProb * 0.6,
          thickness * 0.65
        );
      }

      // Recurse second half
      generateBranch(
        displacedMid,
        end,
        depth + 1,
        segments,
        branchProb,
        thickness * 0.92
      );
    };

    const triggerLightningBolt = (
      origin?: Point,
      target?: Point,
      options?: { isSubtle?: boolean; isDouble?: boolean }
    ) => {
      const now = performance.now();
      const startX = origin ? origin.x : Math.random() * width;
      const startY = origin ? origin.y : Math.random() * (height * 0.15);

      const endX = target
        ? target.x
        : startX + (Math.random() - 0.5) * (width * 0.5);
      const endY = target
        ? target.y
        : startY + height * (0.45 + Math.random() * 0.45);

      const segments: Segment[] = [];
      const thickness = options?.isSubtle ? 1.8 : 2.8 + Math.random() * 1.4;

      generateBranch(
        { x: startX, y: startY },
        { x: endX, y: endY },
        0,
        segments,
        0.35,
        thickness
      );

      // Add sheet flash at lightning origin
      flashes.push({
        x: startX,
        y: Math.max(0, startY - 40),
        radius: 350 + Math.random() * 300,
        startTime: now,
        duration: 380 + Math.random() * 200,
        intensity: options?.isSubtle ? 0.35 : 0.65 + Math.random() * 0.25,
        color: Math.random() > 0.4 ? "#a3e635" : "#38bdf8",
      });

      // Ambient screen illumination flash
      flashes.push({
        x: width * 0.5,
        y: height * 0.2,
        radius: Math.max(width, height) * 0.85,
        startTime: now,
        duration: 280 + Math.random() * 140,
        intensity: options?.isSubtle ? 0.15 : 0.32,
        color: "#f8fafc",
      });

      bolts.push({
        segments,
        startTime: now,
        duration: 420 + Math.random() * 180,
        maxAlpha: options?.isSubtle ? 0.75 : 1.0,
        color: "#ffffff",
        glowColor: Math.random() > 0.35 ? "#bef264" : "#7dd3fc",
        isForked: true,
      });

      // Target impact sparks if a specific target was given (e.g. click)
      if (target) {
        for (let i = 0; i < 28; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 6;
          sparks.push({
            x: target.x,
            y: target.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            life: 1.0,
            maxLife: 20 + Math.random() * 25,
            size: 1.5 + Math.random() * 2.5,
            color: Math.random() > 0.5 ? "#bef264" : "#ffffff",
          });
        }
      }

      // If double strike requested, schedule immediate secondary echo
      if (options?.isDouble) {
        setTimeout(() => {
          if (!isTabVisible) return;
          triggerLightningBolt(
            { x: startX + (Math.random() - 0.5) * 60, y: startY },
            { x: endX + (Math.random() - 0.5) * 80, y: endY },
            { isSubtle: true, isDouble: false }
          );
        }, 110 + Math.random() * 90);
      }
    };

    // Ambient cloud sheet lightning (distant rumbling flash without full ground bolt)
    const triggerSheetLightning = () => {
      const now = performance.now();
      const x = Math.random() * width;
      const y = Math.random() * (height * 0.35);

      flashes.push({
        x,
        y,
        radius: 400 + Math.random() * 400,
        startTime: now,
        duration: 450 + Math.random() * 250,
        intensity: 0.4 + Math.random() * 0.3,
        color: Math.random() > 0.45 ? "#bef264" : "#e0f2fe",
      });

      // Occasional gentle horizontal branch in the clouds
      if (Math.random() > 0.4) {
        const segments: Segment[] = [];
        const length = 200 + Math.random() * 300;
        const angle = (Math.random() - 0.5) * 0.6;
        generateBranch(
          { x, y },
          { x: x + Math.cos(angle) * length, y: y + Math.sin(angle) * length },
          1,
          segments,
          0.25,
          1.5
        );
        bolts.push({
          segments,
          startTime: now,
          duration: 320 + Math.random() * 120,
          maxAlpha: 0.6,
          color: "#ffffff",
          glowColor: "#86efac",
          isForked: false,
        });
      }
    };

    // Autonomous storm scheduling
    const scheduleNextStrike = () => {
      if (!isTabVisible) return;
      const delay = minInterval + Math.random() * (maxInterval - minInterval);
      nextStrikeTimeout = setTimeout(() => {
        // 60% full lightning bolt, 40% distant sheet lightning
        if (Math.random() < 0.65) {
          const isDouble = Math.random() < 0.35;
          triggerLightningBolt(undefined, undefined, { isDouble });
        } else {
          triggerSheetLightning();
        }
        scheduleNextStrike();
      }, delay);
    };

    // Trigger initial welcoming atmospheric strike shortly after mount
    const initialTimer = setTimeout(() => {
      triggerSheetLightning();
      setTimeout(() => {
        triggerLightningBolt(
          { x: width * 0.65, y: height * 0.05 },
          { x: width * 0.5, y: height * 0.7 },
          { isDouble: true }
        );
      }, 700);
      scheduleNextStrike();
    }, 1200);

    // --- INTERACTIVE EVENTS ---
    const handlePointerDown = (e: PointerEvent | MouseEvent) => {
      if (!enableClickStrikes) return;
      // Trigger a dramatic strike targeting the clicked spot
      const targetPoint: Point = { x: e.clientX, y: e.clientY };
      const startPoint: Point = {
        x: e.clientX + (Math.random() - 0.5) * 260,
        y: Math.max(0, e.clientY - 350 - Math.random() * 200),
      };

      triggerLightningBolt(startPoint, targetPoint, { isDouble: false });
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      if (!enableMouseSparks) return;
      mouseThrottle++;
      if (mouseThrottle % 2 !== 0) return; // limit spark density

      const currentPos = { x: e.clientX, y: e.clientY };

      if (lastMousePos) {
        const dx = currentPos.x - lastMousePos.x;
        const dy = currentPos.y - lastMousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Generate tiny crackling electric sparks along fast cursor movement
        if (dist > 14 && Math.random() < 0.45) {
          sparks.push({
            x: currentPos.x + (Math.random() - 0.5) * 8,
            y: currentPos.y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.6,
            vy: (Math.random() - 0.5) * 1.6 - 0.4,
            life: 1.0,
            maxLife: 15 + Math.random() * 15,
            size: 1.2 + Math.random() * 1.6,
            color: Math.random() > 0.4 ? "#bef264" : "#ffffff",
          });
        }
      }
      lastMousePos = currentPos;
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // --- MAIN RENDER LOOP ---
    const render = () => {
      animId = requestAnimationFrame(render);

      if (!isTabVisible) return;

      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      // 1. Render Ambient Sheet / Cloud Flashes
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        const elapsed = now - f.startTime;
        if (elapsed > f.duration) {
          flashes.splice(i, 1);
          continue;
        }

        const progress = elapsed / f.duration;
        // Fast rise, exponential decay with thunder flicker
        let flashAlpha = Math.exp(-progress * 4.2) * f.intensity;
        // Subtle micro-flicker
        if (progress < 0.3) {
          flashAlpha *= 0.8 + 0.2 * Math.sin(progress * Math.PI * 8);
        }

        if (flashAlpha <= 0.005) continue;

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const gradient = ctx.createRadialGradient(
          f.x,
          f.y,
          0,
          f.x,
          f.y,
          f.radius
        );
        gradient.addColorStop(0, `${f.color}${Math.floor(flashAlpha * 255).toString(16).padStart(2, "0")}`);
        gradient.addColorStop(0.5, `${f.color}${Math.floor(flashAlpha * 0.4 * 255).toString(16).padStart(2, "0")}`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(
          Math.max(0, f.x - f.radius),
          Math.max(0, f.y - f.radius),
          f.radius * 2,
          f.radius * 2
        );
        ctx.restore();
      }

      // 2. Render Lightning Bolts (Glow Pass + Core Pass)
      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i];
        const elapsed = now - bolt.startTime;
        if (elapsed > bolt.duration) {
          bolts.splice(i, 1);
          continue;
        }

        const progress = elapsed / bolt.duration;

        // Realistic lightning staccato pulse:
        // Returns 2-3 sharp flash spikes in the first 180ms, then smoothly decays
        let alphaFactor = Math.exp(-progress * 4.8);
        if (progress < 0.15) {
          // Primary strike peak
          alphaFactor = 1.0;
        } else if (progress < 0.25) {
          // Secondary flicker pulse
          alphaFactor = 0.85 + 0.15 * Math.sin((progress - 0.15) * Math.PI * 10);
        }

        const currentAlpha = bolt.maxAlpha * alphaFactor;
        if (currentAlpha <= 0.01) continue;

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalCompositeOperation = "screen";

        // PASS 1: Broad Ionized Glow
        ctx.strokeStyle = bolt.glowColor;
        ctx.shadowColor = bolt.glowColor;
        ctx.shadowBlur = 18;
        ctx.globalAlpha = currentAlpha * 0.55;

        for (const seg of bolt.segments) {
          ctx.lineWidth = seg.width * 4.2;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        // PASS 2: Medium Electric Core
        ctx.shadowBlur = 8;
        ctx.globalAlpha = currentAlpha * 0.85;
        for (const seg of bolt.segments) {
          ctx.lineWidth = seg.width * 1.8;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        // PASS 3: Searing Pure White Core
        ctx.strokeStyle = bolt.color;
        ctx.shadowBlur = 0;
        ctx.globalAlpha = currentAlpha;
        for (const seg of bolt.segments) {
          ctx.lineWidth = Math.max(1, seg.width * 0.85);
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 3. Render Sparks
      if (sparks.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        for (let i = sparks.length - 1; i >= 0; i--) {
          const sp = sparks[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vy += 0.08; // subtle gravity
          sp.life -= 1 / sp.maxLife;

          if (sp.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }

          ctx.fillStyle = sp.color;
          ctx.globalAlpha = sp.life;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      if (nextStrikeTimeout) clearTimeout(nextStrikeTimeout);
      clearTimeout(initialTimer);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [enableClickStrikes, enableMouseSparks, minInterval, maxInterval]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[25] overflow-hidden ${className}`}
      style={{
        mixBlendMode: "screen",
        ...style,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
};

export default ThunderBackground;
