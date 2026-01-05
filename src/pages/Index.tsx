import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Envelope from '../components/Envelope';
import FloatingPetals from '../components/FloatingPetals';
import { WeddingDetails } from '../components/WeddingDetails';
/**
 * Main Index Page
 * Coordinates the transition between the Envelope and the Wedding Details.
 * Handles background music playback.
 * * Fix: Changed imports from '@/' alias to relative paths to resolve build errors.
 */

const Index = () => {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = () => {
    // Start music playback on user interaction (required by browsers)
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        // This catch block handles cases where the browser might still block audio
        console.log("Audio playback was prevented.", error);
      });
    }
    
    // Fade out envelope immediately to transition to the main invitation
    setShowEnvelope(false);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#fdf8f4] overflow-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {/* Background Hearts (FloatingPetals updated to hearts in previous step) */}
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {showEnvelope ? (
          <motion.div
            key="envelope-layer"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.1, 
              filter: 'blur(10px)',
              transition: { duration: 1, ease: "easeInOut" } 
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#fdf8f4]"
          >
            <Envelope onOpen={handleOpen} />
          </motion.div>
        ) : (
          <motion.div
            key="content-layer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="relative z-10 w-full min-h-screen"
          >
            <WeddingDetails isVisible={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Control Overlay */}
      {!showEnvelope && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
          onClick={() => {
            if (audioRef.current) {
              if (audioRef.current.paused) {
                audioRef.current.play();
              } else {
                audioRef.current.pause();
              }
            }
          }}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/80 backdrop-blur-md border border-stone-200 text-stone-600 shadow-sm"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="flex gap-1 items-end h-3">
              <motion.div 
                animate={{ height: ["20%", "100%", "40%"] }} 
                transition={{ repeat: Infinity, duration: 0.6 }} 
                className="w-1 bg-rose-300" 
              />
              <motion.div 
                animate={{ height: ["40%", "20%", "80%"] }} 
                transition={{ repeat: Infinity, duration: 0.8 }} 
                className="w-1 bg-rose-400" 
              />
              <motion.div 
                animate={{ height: ["60%", "100%", "20%"] }} 
                transition={{ repeat: Infinity, duration: 0.5 }} 
                className="w-1 bg-rose-300" 
              />
            </div>
            <span className="text-[10px] font-sans uppercase tracking-[0.2em]">Music</span>
          </div>
        </motion.button>
      )}
    </main>
  );
};

export default Index;
