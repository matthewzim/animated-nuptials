import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Realistic Envelope Component (Build-Safe Version)
 * Fixes potential build errors:
 * 1. Replaced dangerouslySetInnerHTML style tag with inline React style objects.
 * 2. Standardized SVG filter attributes for strict React/TS compliance.
 * 3. Simplified 3D transform utilities.
 */

interface EnvelopeProps {
  onOpen?: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen?.();
  };

  // Common styles to replace custom classes
  const preserve3d: React.CSSProperties = { transformStyle: 'preserve-3d' };
  const backfaceHidden: React.CSSProperties = { backfaceVisibility: 'hidden' };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 overflow-hidden font-serif">
      {/* SVG Filter for Paper Texture */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="paper-grain">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.6" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.1" />
            <feFuncG type="linear" slope="0.1" />
            <feFuncB type="linear" slope="0.1" />
            <feFuncA type="linear" slope="0.05" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </svg>
      
      {/* Scene Container */}
      <div className="relative w-full max-w-lg md:max-w-2xl lg:max-w-4xl aspect-[4/3]">
        
        {/* Floor Shadow */}
        <div className="absolute bottom-10 w-[80%] h-12 bg-black/5 blur-3xl rounded-[100%] transform -translate-y-10" />

        {/* 3D Envelope Wrapper */}
        <div className="relative w-full h-full" style={{ perspective: '2000px' }}>
          <motion.div
            initial={false}
            animate={{ rotateX: isOpen ? 10 : 0, y: isOpen ? 100 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative w-full h-full"
            style={preserve3d}
          >
            {/* ENVELOPE BACK */}
            <div 
              className="absolute inset-0 border border-stone-200/50 rounded-sm shadow-xl overflow-hidden"
              style={{ 
                backgroundImage: 'url(/envelopebackground.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/5 via-transparent to-transparent opacity-30" />
            </div>

            {/* INVITATION CARD */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ y: 0, translateZ: -1 }}
                  animate={{ y: -250, translateZ: 50, rotateX: -5 }}
                  exit={{ y: 0, translateZ: -1 }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className="absolute left-[5%] top-[5%] w-[90%] h-[90%] bg-white shadow-2xl rounded-sm p-8 md:p-12 border border-stone-100 flex flex-col items-center justify-center text-center overflow-hidden"
                  style={{ filter: 'url(#paper-grain)' }}
                >
                  <div className="border-4 border-double border-stone-200 p-6 md:p-10 w-full h-full flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <h2 className="text-stone-400 uppercase tracking-[0.3em] text-sm mb-4">You are cordially invited</h2>
                      <h1 className="text-4xl md:text-6xl text-stone-800 mb-6 italic leading-tight">Your Story Unfolds</h1>
                      <div className="w-16 h-px bg-stone-300 mx-auto mb-6" />
                      <p className="text-stone-600 max-w-md mx-auto text-lg leading-relaxed">
                        Join us as we celebrate the beginning of a new chapter in our lives together.
                      </p>
                      <div className="mt-8 text-stone-500 font-sans tracking-widest text-xs uppercase">
                        Summer 2026 • Estate Gardens
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ENVELOPE FRONT - BOTTOM FLAP */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-3/5 origin-bottom z-20"
              style={{ 
                clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)',
                backgroundImage: 'url(/envelopebackground.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Inner edge shadows for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/8 to-transparent" />
              <div 
                className="absolute inset-0" 
                style={{
                  background: 'linear-gradient(to bottom right, rgba(0,0,0,0.15) 0%, transparent 30%), linear-gradient(to bottom left, rgba(0,0,0,0.15) 0%, transparent 30%)'
                }}
              />
            </div>

            {/* ENVELOPE FRONT - SIDE FLAPS */}
            <div 
              className="absolute inset-y-0 left-0 w-3/5 z-10"
              style={{ 
                clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)',
                backgroundImage: 'url(/envelopebackground.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Inner edge shadow along diagonal */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/8 to-transparent" />
              <div 
                className="absolute inset-0" 
                style={{
                  background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.12) 80%, rgba(0,0,0,0.18) 100%)'
                }}
              />
            </div>
            <div 
              className="absolute inset-y-0 right-0 w-3/5 z-10"
              style={{ 
                clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)',
                backgroundImage: 'url(/envelopebackground.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Subtle base shadow */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent" />
              {/* Upper right edge shadow only */}
              <div 
                className="absolute inset-0" 
                style={{
                  background: 'linear-gradient(225deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.12) 15%, transparent 35%)'
                }}
              />
            </div>

            {/* ENVELOPE FRONT - TOP FLAP */}
            <motion.div
              animate={{ rotateX: isOpen ? -170 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute top-0 left-0 right-0 h-3/5 origin-top z-30"
              style={{ 
                ...preserve3d,
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                backgroundImage: 'url(/envelopebackground.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Flap Underside (Visible when open) */}
              <div 
                className="absolute inset-0" 
                style={{ 
                  ...backfaceHidden, 
                  transform: 'rotateX(180deg)',
                  backgroundImage: 'url(/envelopebackground.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} 
              />
              
              {/* Flap Top Detail */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
            </motion.div>

            {/* INTERACTIVE WAX SEAL */}
            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  onClick={handleOpen}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute left-[45%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer"
                >
                  <img 
                    src="/waxseal.png" 
                    alt="Wax seal" 
                    className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain filter drop-shadow-lg"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-stone-600 uppercase tracking-widest text-xs mb-1">
          {isOpen ? "Refresh to reseal the envelope" : "Click the wax seal to open"}
        </p>
        {!isOpen && (
          <p className="text-stone-500 uppercase tracking-widest text-[10px]">
            Turn on sound
          </p>
        )}
      </motion.div>
    </div>
  );
}
