import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function fireConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const W = window.innerWidth;
  const H = window.innerHeight;

  const colors = [
    '#ff6b8a', '#ff9a76', '#ffd166', '#06d6a0', '#118ab2',
    '#8338ec', '#ff006e', '#fb5607', '#3a86ff', '#ffbe0b',
    '#e07cff', '#00f5d4',
  ];

  interface Particle {
    x: number; y: number; vx: number; vy: number;
    w: number; h: number; color: string;
    rotation: number; rotationSpeed: number;
    gravity: number; drag: number; opacity: number;
  }

  const particles: Particle[] = [];

  // Spawn from all four edges
  const spawn = (count: number, fromX: () => number, fromY: () => number, vxRange: [number, number], vyRange: [number, number]) => {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: fromX(), y: fromY(),
        vx: vxRange[0] + Math.random() * (vxRange[1] - vxRange[0]),
        vy: vyRange[0] + Math.random() * (vyRange[1] - vyRange[0]),
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.12 + Math.random() * 0.08,
        drag: 0.98 + Math.random() * 0.015,
        opacity: 1,
      });
    }
  };

  const n = 80;
  // Left edge
  spawn(n, () => -10, () => Math.random() * H, [4, 14], [-6, 6]);
  // Right edge
  spawn(n, () => W + 10, () => Math.random() * H, [-14, -4], [-6, 6]);
  // Top edge
  spawn(n, () => Math.random() * W, () => -10, [-6, 6], [4, 12]);
  // Bottom edge
  spawn(n, () => Math.random() * W, () => H + 10, [-6, 6], [-12, -4]);

  let frame: number;
  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of particles) {
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      // Fade out once past screen center region
      if (p.y > H * 0.6) p.opacity -= 0.008;
      if (p.x < -100 || p.x > W + 100) p.opacity -= 0.02;
      if (p.opacity <= 0) continue;
      alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive) {
      frame = requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  };
  frame = requestAnimationFrame(animate);
}

interface ScratchCardProps {
  imageSrc: string;
  revealThreshold?: number;
  width?: number;
  height?: number;
  interactive?: boolean;
}

export default function ScratchCard({
  imageSrc,
  revealThreshold = 0.6,
  width = 320,
  height = 420,
  interactive = true,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const [percentScratched, setPercentScratched] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const handleAnswer = () => {
    setAnswered(true);
    fireConfetti();
    // Flip the card after a short delay to let confetti start
    setTimeout(() => setFlipped(true), 800);
  };
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const brushRadius = 28;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctxRef.current = ctx;

    // Draw scratch texture
    drawScratchTexture(ctx, width, height);
  }, [width, height]);

  const drawScratchTexture = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number
  ) => {
    // Base silver/grey gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#c0c0c0');
    grad.addColorStop(0.3, '#d4d4d4');
    grad.addColorStop(0.5, '#b8b8b8');
    grad.addColorStop(0.7, '#cfcfcf');
    grad.addColorStop(1, '#a8a8a8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Add noise/grain texture
    for (let i = 0; i < 12000; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const brightness = Math.random() * 40 - 20;
      const alpha = Math.random() * 0.15 + 0.05;
      ctx.fillStyle = `rgba(${128 + brightness}, ${128 + brightness}, ${128 + brightness}, ${alpha})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // Subtle horizontal streaks for realism
    for (let i = 0; i < 30; i++) {
      const y = Math.random() * h;
      ctx.strokeStyle = `rgba(180, 180, 180, ${Math.random() * 0.2 + 0.05})`;
      ctx.lineWidth = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }

    // Shimmer highlights
    const shimmer = ctx.createLinearGradient(0, 0, w * 0.7, h * 0.7);
    shimmer.addColorStop(0, 'rgba(255, 255, 255, 0)');
    shimmer.addColorStop(0.45, 'rgba(255, 255, 255, 0.12)');
    shimmer.addColorStop(0.55, 'rgba(255, 255, 255, 0)');
    shimmer.addColorStop(1, 'rgba(255, 255, 255, 0.06)');
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, 0, w, h);
  };

  const getCanvasPoint = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;
      if ('touches' in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  const clearCircle = useCallback(
    (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
      // Use clearRect for the inner square area — guarantees 100% transparency
      // Coordinates are in CSS pixels (ctx already has DPR scale applied)
      const innerR = brushRadius * 0.7;
      ctx.clearRect(cx - innerR, cy - innerR, innerR * 2, innerR * 2);
      // Then draw destination-out arc for smooth circular edges
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.restore();
    },
    []
  );

  const scratch = useCallback(
    (x: number, y: number) => {
      const ctx = ctxRef.current;
      if (!ctx || revealed || fadingOut || !interactive) return;

      clearCircle(ctx, x, y);

      // Interpolate between last point and current for smooth strokes
      if (lastPoint.current) {
        const dx = x - lastPoint.current.x;
        const dy = y - lastPoint.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.ceil(dist / (brushRadius * 0.25));
        for (let i = 1; i < steps; i++) {
          const t = i / steps;
          const ix = lastPoint.current.x + dx * t;
          const iy = lastPoint.current.y + dy * t;
          clearCircle(ctx, ix, iy);
        }
      }

      lastPoint.current = { x, y };
    },
    [revealed, fadingOut, interactive, clearCircle]
  );

  const calculateScratched = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    const total = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) transparent++;
    }

    const pct = transparent / (total / 4);
    setPercentScratched(pct);

    if (pct >= revealThreshold && !revealed && !fadingOut) {
      setFadingOut(true);
      setTimeout(() => setRevealed(true), 600);
    }
  }, [revealThreshold, revealed, fadingOut]);

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!interactive) return;
      isDrawing.current = true;
      lastPoint.current = null;
      const pt = getCanvasPoint(e);
      if (pt) scratch(pt.x, pt.y);
    },
    [getCanvasPoint, scratch, interactive]
  );

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing.current) return;
      const pt = getCanvasPoint(e);
      if (pt) scratch(pt.x, pt.y);
    },
    [getCanvasPoint, scratch]
  );

  const handleEnd = useCallback(() => {
    isDrawing.current = false;
    lastPoint.current = null;
    calculateScratched();
  }, [calculateScratched]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Instruction text */}
      <AnimatePresence>
        {!revealed && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-[#5c6f8b] text-lg font-semibold tracking-[0.15em] uppercase"
          >
            Scratch to reveal
          </motion.p>
        )}
      </AnimatePresence>

      {/* Revealed message + buttons */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center gap-5"
          >
            <p className="font-script text-4xl text-[#5c6f8b] md:text-5xl">
              Groomsman?
            </p>

            {!answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAnswer}
                  className="px-10 py-4 text-2xl font-bold uppercase tracking-widest text-white rounded-xl shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #5c8fbf 0%, #7ba4c9 100%)',
                    boxShadow: '0 8px 25px rgba(92, 143, 191, 0.4)',
                  }}
                >
                  Yes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAnswer}
                  className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#5c6f8b]/70 rounded-md border border-[#bdd5ef]"
                >
                  No
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card container with 3D flip */}
      <div style={{ width, height, perspective: 1000 }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              boxShadow:
                '0 20px 50px rgba(90, 116, 146, 0.25), 0 4px 16px rgba(0,0,0,0.1)',
            }}
          >
            {/* Hidden image underneath */}
            <img
              src={imageSrc}
              alt="Reveal"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            {/* Canvas scratch layer */}
            <motion.canvas
              ref={canvasRef}
              animate={{ opacity: fadingOut ? 0 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`absolute inset-0 rounded-2xl touch-none ${interactive ? 'cursor-crosshair' : 'cursor-default'}`}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            />
          </div>

          {/* Back face — responsibilities */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center px-6 py-8"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #e9f3ff 0%, #dae8fa 100%)',
              boxShadow:
                '0 20px 50px rgba(90, 116, 146, 0.25), 0 4px 16px rgba(0,0,0,0.1)',
            }}
          >
            <h2 className="text-2xl font-bold text-[#3a5a80] mb-5 tracking-wide">
              Responsibilities
            </h2>
            <div className="text-[#3a5a80] text-sm leading-relaxed text-center space-y-1">
              <p className="font-bold">Saturday, August 1st (Date TBD) Bachelor Party</p>
              <p>Morning: Gun Range</p>
              <p>Afternoon: Sauna + Cold Plunge</p>
              <p>Dinner: Olive Garden</p>
              <p className="font-bold pt-3">August 8th Wedding</p>
              <p>5km run in the morning before the wedding</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
