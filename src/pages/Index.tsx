import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Envelope from '../components/Envelope';
import FloatingPetals from '../components/FloatingPetals';
import { WeddingDetails } from '../components/WeddingDetails';

const headerVideo = '/Header_chrome.mp4';

/**
 * Main Index Page
 * Coordinates the transition between the Envelope, autoplay Video, and Wedding Details.
 */
const Index = () => {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showOverlayText, setShowOverlayText] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleOpen = () => {
    setShowEnvelope(false);
    
    // Start video and audio playback with sound
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(console.error);
      }
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(console.error);
      }
      // Show overlay text with fade in
      setShowOverlayText(true);
      
      // Hide overlay text after 5 seconds
      setTimeout(() => {
        setShowOverlayText(false);
      }, 5000);
    }, 100);
  };


  return (
    <main className="relative min-h-screen w-full bg-[#fdf8f4]">
      <audio ref={audioRef} loop muted>
        <source src="/open.mp3" type="audio/mpeg" />
      </audio>

      <AnimatePresence mode="wait">
        {showEnvelope ? (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fdf8f4]"
          >
            <Envelope onOpen={handleOpen} />
          </motion.div>
        ) : (
          <div key="main-content">
            <FloatingPetals />

            {/* Video Section */}
            <section className="relative w-full h-screen">
              <div className="fixed inset-0 z-0">
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={headerVideo} type="video/mp4" />
                </video>
              </div>

              {/* Overlay Text with Fade In/Out */}
              <AnimatePresence>
                {showOverlayText && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute top-1/4 left-0 right-0 z-10 text-center pointer-events-none"
                  >
                    <div className="space-y-2">
                      <p className="text-white text-lg md:text-xl font-extralight tracking-[0.3em] uppercase drop-shadow-xl">
                        08.08.2026
                      </p>
                      <h2 className="text-white text-3xl md:text-5xl font-extralight tracking-[0.3em] uppercase drop-shadow-xl">
                        You're Cordially Invited
                      </h2>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Wedding Details */}
            <div className="relative z-20 bg-[#fdf8f4] shadow-[0_-40px_60px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none z-30">
                <FloatingPetals />
              </div>
              <WeddingDetails isVisible={!showEnvelope} />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Music Control Button */}
      {!showEnvelope && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
            }
          }}
          className="fixed bottom-6 right-6 z-[110] p-3 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 text-stone-600 shadow-lg"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="flex gap-1 items-end h-3">
              <motion.div animate={{ height: ["20%", "100%", "40%"] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-rose-300" />
              <motion.div animate={{ height: ["40%", "20%", "80%"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-rose-400" />
              <motion.div animate={{ height: ["60%", "100%", "20%"] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-rose-300" />
            </div>
          </div>
        </motion.button>
      )}
    </main>
  );
};

export default Index;
