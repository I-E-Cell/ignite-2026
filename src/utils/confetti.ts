// Lightweight zero-dependency canvas confetti generator
export function triggerConfetti() {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = [
    "#5C8C3A", // Forest green
    "#8FC45A", // Bright lime
    "#2F5527", // Deep emerald
    "#141412", // Obsidian
    "#F4F3F0", // Cream
    "#F59E0B", // Amber Gold
    "#10B981", // Mint
    "#6366F1", // Indigo
  ];

  interface Particle {
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    vy: number;
    rotation: number;
    vRot: number;
    color: string;
    opacity: number;
  }

  const particles: Particle[] = [];
  const particleCount = 140;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 200,
      y: height * 0.4 + (Math.random() - 0.5) * 100,
      w: Math.random() * 8 + 6,
      h: Math.random() * 12 + 6,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
    });
  }

  let animationFrameId: number;
  const gravity = 0.45;
  const drag = 0.985;
  const startTime = Date.now();
  const duration = 3800; // ms

  function update() {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration) {
      cancelAnimationFrame(animationFrameId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
      return;
    }

    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.vy += gravity;
      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;

      if (elapsed > duration * 0.6) {
        p.opacity = Math.max(0, 1 - (elapsed - duration * 0.6) / (duration * 0.4));
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(update);
  }

  animationFrameId = requestAnimationFrame(update);
}
