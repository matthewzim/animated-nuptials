import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * FloatingHearts Component
 * Replaces the previous "FloatingPetals" to use heart shapes.
 * Maintains the gentle falling animation with randomized properties.
 */

interface Heart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  color: string;
}

const colors = [
  '#fecaca', // red-200
  '#fde2e2', // red-100
  '#fee2e2', // rose-100
  '#fff1f2', // rose-50
  '#fae8ff', // purple-100
];

const HeartIcon = ({ color, size }: { color: string; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function FloatingPetals() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage of screen width
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 20,
      size: 12 + Math.random() * 24,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ 
            top: -50, 
            left: `${heart.x}%`, 
            opacity: 0,
            rotate: heart.rotation 
          }}
          animate={{
            top: '110vh',
            left: `${heart.x + (Math.random() * 10 - 5)}%`,
            opacity: [0, 0.7, 0.7, 0],
            rotate: heart.rotation + 360,
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          className="absolute"
        >
          <HeartIcon color={heart.color} size={heart.size} />
        </motion.div>
      ))}
    </div>
  );
}
