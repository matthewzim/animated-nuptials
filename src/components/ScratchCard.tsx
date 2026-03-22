import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScratchCardProps {
  imageSrc: string;
  revealThreshold?: number;
  width?: number;
  height?: number;
}

export default function ScratchCard({
  imageSrc,
  revealThreshold = 0.7,
  width = 320,
  height = 420,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const [percentScratched, setPercentScratched] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
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

  const scratch = useCallback(
    (x: number, y: number) => {
      const ctx = ctxRef.current;
      if (!ctx || revealed || fadingOut) return;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();

      // Interpolate between last point and current for smooth strokes
      if (lastPoint.current) {
        const dx = x - lastPoint.current.x;
        const dy = y - lastPoint.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.ceil(dist / (brushRadius * 0.4));
        for (let i = 1; i < steps; i++) {
          const t = i / steps;
          const ix = lastPoint.current.x + dx * t;
          const iy = lastPoint.current.y + dy * t;
          ctx.beginPath();
          ctx.arc(ix, iy, brushRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      lastPoint.current = { x, y };
      ctx.globalCompositeOperation = 'source-over';
    },
    [revealed, fadingOut]
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
      isDrawing.current = true;
      lastPoint.current = null;
      const pt = getCanvasPoint(e);
      if (pt) scratch(pt.x, pt.y);
    },
    [getCanvasPoint, scratch]
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

      {/* Revealed message */}
      <AnimatePresence>
        {revealed && (
          <motion.p
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-script text-4xl text-[#5c6f8b] md:text-5xl"
          >
            Groomsman?
          </motion.p>
        )}
      </AnimatePresence>

      {/* Card container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width,
          height,
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
          className="absolute inset-0 rounded-2xl cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>
    </div>
  );
}
