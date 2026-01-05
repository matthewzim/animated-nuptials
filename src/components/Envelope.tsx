import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideHeart } from 'lucide-react';

/**
 * Enhanced Realistic Envelope Component
 * Features:
 * 1. SVG Paper Texture Filter for realistic grain.
 * 2. Multi-layered fold shadows for depth.
 * 3. Responsive large-scale sizing.
 * 4. Interactive opening animation.
 */

const PaperTextureFilter = () => (
  <svg className="hidden">
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
);

const WaxSeal = ({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) => (
  <motion.div
    onClick={onClick}
    animate={{ 
      scale: isOpen ? 0.8 : 1,
      opacity: isOpen ? 0 : 1,
      y: isOpen ? -20 : 0
    }}
    whileHover={{ scale: 1.05 }}
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer"
  >
    <div className="relative w-20 h-20 filter drop-shadow-lg">
      {/* Wax base */}
      <div className="absolute inset-0 bg-red-700 rounded-full rotate-12 opacity-90 scale-110" />
      <div className="absolute inset-0 bg-red-800 rounded-full -rotate-6" />
      
      {/* Wax inner detail */}
      <div className="absolute inset-2 border-2 border-red-900/30 rounded-full flex items-center justify-center bg-red-700 shadow-inner">
        <LucideHeart className="text-red-200 fill-red-200/20 w-8 h-8" />
      </div>
      
      {/* Wax highlight */}
      <div className="absolute top-2 left-4 w-4 h-4 bg-white/10 rounded-full blur-[2px]" />
    </div>
  </motion.div>
);

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdf8f4] flex items-center justify-center p-4 md:p-8 overflow-hidden font-serif">
      <PaperTextureFilter />
      
      {/* Container to scale the entire scene */}
      <div className="relative w-full max-w-4xl aspect-[4/3] flex items-center justify-center">
        
        {/* Shadow floor for the envelope */}
        <div className="absolute bottom-10 w-[80%] h-12 bg-black/5 blur-3xl rounded-[100%] transform -translate-y-10" />

        <div className="relative w-full h-full perspective-[2000px]">
          <motion.div
            initial={false}
            animate={{ rotateX: isOpen ? 10 : 0, y: isOpen ? 100 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative w-full h-full preserve-3d"
          >
            {/* ENVELOPE BACK (The Base) */}
            <div 
              className="absolute inset-0 bg-[#f4f1ea] border border-stone-200/50 rounded-sm shadow-xl overflow-hidden"
              style={{ filter: 'url(#paper-grain)' }}
            >
              {/* Subtle Fold Lines on the back */}
              <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/5 via-transparent to-transparent opacity-30" />
            </div>

            {/* INVITATION CARD (Sliding out) */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ y: 0, z: -1 }}
                  animate={{ y: -250, z: 50, rotateX: -5 }}
                  exit={{ y: 0, z: -1 }}
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

            {/* ENVELOPE FRONT FLAPS (The visual exterior) */}
            
            {/* Bottom Flap */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-3/5 bg-[#ece8df] origin-bottom z-20"
              style={{ 
                clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)',
                filter: 'url(#paper-grain)',
                boxShadow: 'inset 0 10px 20px -10px rgba(0,0,0,0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </div>

            {/* Side Flaps */}
            <div 
              className="absolute inset-y-0 left-0 w-3/5 bg-[#f0ede6] z-10"
              style={{ 
                clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)',
                filter: 'url(#paper-grain)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent" />
            </div>
            <div 
              className="absolute inset-y-0 right-0 w-3/5 bg-[#f0ede6] z-10"
              style={{ 
                clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)',
                filter: 'url(#paper-grain)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent" />
            </div>

            {/* Top Flap (The animated part) */}
            <motion.div
              animate={{ rotateX: isOpen ? -170 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute top-0 left-0 right-0 h-3/5 bg-[#ece8df] origin-top z-30 preserve-3d"
              style={{ 
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                filter: 'url(#paper-grain)',
              }}
            >
              {/* Flap Underside (Visible when open) */}
              <div className="absolute inset-0 backface-hidden bg-[#e5e1d7] rotate-x-180" />
              
              {/* Flap Top Detail */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
            </motion.div>

            {/* Interactive Seal */}
            {!isOpen && (
              <WaxSeal onClick={() => setIsOpen(true)} isOpen={isOpen} />
            )}
          </motion.div>
        </div>
      </div>

      {/* Helper instructions */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="absolute bottom-8 text-stone-400 uppercase tracking-widest text-[10px]"
      >
        {isOpen ? "Refresh to reseal the envelope" : "Click the wax seal to open"}
      </motion.p>

      <style dangerouslySetInnerHTML={{ __html: `
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-x-180 { transform: rotateX(180deg); }
      `}} />
    </div>
  );
}
      </div>
    </div>
  );
};
