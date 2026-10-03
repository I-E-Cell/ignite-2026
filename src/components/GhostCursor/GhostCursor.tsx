import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import './GhostCursor.css';

interface GhostCursorProps {
  className?: string;
  style?: React.CSSProperties;
  trailLength?: number;
  inertia?: number;
  grainIntensity?: number;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  brightness?: number;
  color?: string;
  mixBlendMode?: string;
  edgeIntensity?: number;
  maxDevicePixelRatio?: number;
  targetPixels?: number;
  fadeDelayMs?: number;
  fadeDurationMs?: number;
  zIndex?: number;
}

const GhostCursor = ({
  className,
  style,
  trailLength = 50,
  inertia = 0.5,
  grainIntensity = 0.05,
  bloomStrength = 0.1,
  bloomRadius = 1.0,
  bloomThreshold = 0.025,
  brightness = 1,
  color = '#B497CF',
  mixBlendMode = 'screen',
  edgeIntensity = 0,
  maxDevicePixelRatio = 0.5,
  targetPixels,
  fadeDelayMs,
  fadeDurationMs,
  zIndex = 10,
}: GhostCursorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const filmPassRef = useRef<ShaderPass | null>(null);

  const trailBufRef = useRef<THREE.Vector2[]>([]);
  const headRef = useRef(0);

  const rafRef = useRef<number | null>(null);
  const resizeObsRef = useRef<ResizeObserver | null>(null);
  const currentMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const velocityRef = useRef(new THREE.Vector2(0.5, 0.5));
  const fadeOpacityRef = useRef(0.0);
  const hasMovedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const lastMoveTimeRef = useRef(
    typeof performance !== 'undefined' ? performance.now() : Date.now()
  );
  const pointerActiveRef = useRef(false);
  const runningRef = useRef(false);
  const hasValidSizeRef = useRef(false);

  const isTouch = useMemo(
    () =>
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    []
  );

  const pixelBudget = targetPixels ?? (isTouch ? 0.9e6 : 1.3e6);
  const fadeDelay = fadeDelayMs ?? (isTouch ? 500 : 1000);
  const fadeDuration = fadeDurationMs ?? (isTouch ? 1000 : 1500);

  const baseVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float iTime;
    uniform vec3  iResolution;
    uniform vec2  iMouse;
    uniform vec2  iPrevMouse[MAX_TRAIL_LENGTH];
    uniform float iOpacity;
    uniform float iScale;
    uniform vec3  iBaseColor;
    uniform float iBrightness;
    uniform float iEdgeIntensity;
    varying vec2  vUv;

    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      f *= f * (3. - 2. * f);
      return mix(mix(hash(i + vec2(0.,0.)), hash(i + vec2(1.,0.)), f.x),
                 mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
    }
    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
      mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for(int i=0;i<5;i++){
        v += a * noise(p);
        p = m * p * 2.0;
        a *= 0.5;
      }
      return v;
    }
    vec3 tint1(vec3 base){ return mix(base, vec3(1.0), 0.15); }
    vec3 tint2(vec3 base){ return mix(base, vec3(0.8, 0.9, 1.0), 0.25); }

    vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
      vec2 q = vec2(fbm(p * iScale + iTime * 0.1), fbm(p * iScale + vec2(5.2,1.3) + iTime * 0.1));
      vec2 r = vec2(fbm(p * iScale + q * 1.5 + iTime * 0.15), fbm(p * iScale + q * 1.5 + vec2(8.3,2.8) + iTime * 0.15));

      float smoke = fbm(p * iScale + r * 0.8);
      float radius = 0.5 + 0.3 * (1.0 / iScale);
      float distFactor = 1.0 - smoothstep(0.0, radius * activity, length(p - mousePos));
      float alpha = pow(smoke, 2.5) * distFactor;

      vec3 c1 = tint1(iBaseColor);
      vec3 c2 = tint2(iBaseColor);
      vec3 color = mix(c1, c2, sin(iTime * 0.5) * 0.5 + 0.5);

      return vec4(color * alpha * intensity, alpha * intensity);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
      vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

      vec3 colorAcc = vec3(0.0);
      float alphaAcc = 0.0;

      vec4 b = blob(uv, mouse, 1.0, iOpacity);
      colorAcc += b.rgb;
      alphaAcc += b.a;

      for (int i = 0; i < MAX_TRAIL_LENGTH; i++) {
        vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
        float t = 1.0 - float(i) / float(MAX_TRAIL_LENGTH);
        t = pow(t, 2.0);
        if (t > 0.01) {
          vec4 bt = blob(uv, pm, t * 0.8, iOpacity);
          colorAcc += bt.rgb;
          alphaAcc += bt.a;
        }
      }

      colorAcc *= iBrightness;
      alphaAcc *= iBrightness;

      float edgeFade = 1.0;
      if (iEdgeIntensity > 0.0) {
        vec2 edge = smoothstep(vec2(0.0), vec2(0.15), vUv) * (1.0 - smoothstep(vec2(0.85), vec2(1.0), vUv));
        edgeFade = mix(1.0, edge.x * edge.y, iEdgeIntensity);
      }

      gl_FragColor = vec4(colorAcc * edgeFade, alphaAcc * edgeFade * iOpacity);
    }
  `;

  const filmGrainShader = {
    uniforms: {
      tDiffuse: { value: null },
      iTime: { value: 0 },
      intensity: { value: grainIntensity },
    },
    vertexShader: baseVertexShader,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float iTime;
      uniform float intensity;
      varying vec2 vUv;
      float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float grain = rand(vUv * iTime) * intensity;
        gl_FragColor = vec4(color.rgb + grain, color.a);
      }
    `,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const col = new THREE.Color(color);
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
      iMouse: { value: new THREE.Vector2(0.5, 0.5) },
      iPrevMouse: { value: [] as THREE.Vector2[] },
      iOpacity: { value: 0.0 },
      iScale: { value: 3.0 },
      iBaseColor: { value: new THREE.Vector3(col.r, col.g, col.b) },
      iBrightness: { value: brightness },
      iEdgeIntensity: { value: edgeIntensity },
    };

    for (let i = 0; i < trailLength; i++) {
      (uniforms.iPrevMouse.value as THREE.Vector2[]).push(new THREE.Vector2(0.5, 0.5));
    }

    trailBufRef.current = (uniforms.iPrevMouse.value as THREE.Vector2[]).slice();
    headRef.current = 0;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: baseVertexShader,
      fragmentShader: fragmentShader.replace(/MAX_TRAIL_LENGTH/g, String(trailLength)),
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    materialRef.current = material;

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      bloomStrength,
      bloomRadius,
      bloomThreshold
    );
    bloomPassRef.current = bloomPass;
    composer.addPass(bloomPass);

    const filmPass = new ShaderPass(filmGrainShader);
    filmPassRef.current = filmPass;
    composer.addPass(filmPass);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 1 || h < 1) {
        hasValidSizeRef.current = false;
        return;
      }
      hasValidSizeRef.current = true;

      const area = w * h;
      const scale = Math.min(
        Math.sqrt(pixelBudget / area),
        maxDevicePixelRatio * window.devicePixelRatio
      );

      renderer.setPixelRatio(scale);
      renderer.setSize(w, h);
      composer.setSize(w * scale, h * scale);
      bloomPass.resolution.set(w * scale, h * scale);
      uniforms.iResolution.value.set(w * scale, h * scale, 1);
    };

    const obs = new ResizeObserver(resize);
    obs.observe(container);
    resizeObsRef.current = obs;
    resize();

    const onMove = (x: number, y: number) => {
      const rect = container.getBoundingClientRect();
      const nx = (x - rect.left) / rect.width;
      const ny = 1 - (y - rect.top) / rect.height;
      currentMouseRef.current.set(nx, ny);

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        velocityRef.current.set(nx, ny);
        const buf = trailBufRef.current;
        for (let i = 0; i < buf.length; i++) {
          buf[i].set(nx, ny);
        }
      }

      pointerActiveRef.current = true;
      lastMoveTimeRef.current = performance.now();
      fadeOpacityRef.current = 1.0;
    };

    const onPointerMove = (e: PointerEvent | MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        onMove(e.clientX, e.clientY);
      } else if (pointerActiveRef.current) {
        pointerActiveRef.current = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          onMove(touch.clientX, touch.clientY);
        } else if (pointerActiveRef.current) {
          pointerActiveRef.current = false;
        }
      }
    };

    const onLeave = () => {
      pointerActiveRef.current = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onLeave);
    document.addEventListener('mouseleave', onLeave);

    const intersectionObs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    intersectionObs.observe(container);

    let startTime = performance.now();
    runningRef.current = true;

    const tick = () => {
      if (!runningRef.current) return;
      rafRef.current = requestAnimationFrame(tick);

      if (!hasValidSizeRef.current || !isVisibleRef.current) return;

      const now = performance.now();
      uniforms.iTime.value = (now - startTime) * 0.001;

      // Inertia
      const target = currentMouseRef.current;
      const vel = velocityRef.current;
      vel.x += (target.x - vel.x) * (1 - inertia);
      vel.y += (target.y - vel.y) * (1 - inertia);
      uniforms.iMouse.value.set(vel.x, vel.y);

      // Ring buffer trail
      const buf = trailBufRef.current;
      const idx = headRef.current;
      buf[idx].set(vel.x, vel.y);
      headRef.current = (idx + 1) % trailLength;

      // Unroll ring into uniform array
      const arr = uniforms.iPrevMouse.value as THREE.Vector2[];
      for (let i = 0; i < trailLength; i++) {
        const ri = (headRef.current - 1 - i + trailLength * 2) % trailLength;
        arr[i].copy(buf[ri]);
      }

      // Fade
      const idle = now - lastMoveTimeRef.current;
      if (idle > fadeDelay) {
        fadeOpacityRef.current = Math.max(
          0,
          1 - (idle - fadeDelay) / fadeDuration
        );
      }
      uniforms.iOpacity.value = fadeOpacityRef.current;

      if (filmPassRef.current) {
        filmPassRef.current.uniforms.iTime.value = uniforms.iTime.value;
      }

      composer.render();
    };
    tick();

    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      obs.disconnect();
      intersectionObs.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onLeave);
      document.removeEventListener('mouseleave', onLeave);
      renderer.dispose();
      material.dispose();
      composer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`ghost-cursor-container ${className ?? ''}`}
      style={{
        ...style,
        mixBlendMode: mixBlendMode as React.CSSProperties['mixBlendMode'],
        zIndex,
      }}
    />
  );
};

export default GhostCursor;
