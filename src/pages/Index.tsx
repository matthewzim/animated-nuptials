import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Envelope from '../components/Envelope';
import FloatingPetals from '../components/FloatingPetals';
import { WeddingDetails } from '../components/WeddingDetails';

/**
 * Main Index Page
 * Coordinates the transition between the Envelope, the Scroll-Driven Video, and Wedding Details.
 */
const Index = () => {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  // Configuration for the scroll scrub
  // Note: 'public/header.mp4' is served at the root path '/' in Vite/Next.js
  const videoSrc = "/header.mp4"; 
  const pixelsPerSecond = 1000; // Adjust this to make the scroll faster or slower

  const handleOpen = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio blocked", err));
    }
    setShowEnvelope(false);
  };

  useEffect(() => {
    // Only set up scroll listeners if the envelope is hidden
    if (showEnvelope) return;

    const video = videoRef.current;
    const track = scrollTrackRef.current;
    if (!video || !track) return;

    const updateTrackHeight = () => {
      if (video.duration) {
        // Calculate total height: view height + duration-based buffer
        // This creates the 'depth' the user must scroll through
        const trackHeight = window.innerHeight + (video.duration * pixelsPerSecond);
        track.style.height = `${trackHeight}px`;
        setIsVideoReady(true);
      }
    };

    const handleScroll = () => {
      if (!video.duration || !isVideoReady) return;

      const rect = track.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // Calculate progress (0 to 1) based on track position relative to viewport
      const scrollOffset = -rect.top;
      const totalScrollable = rect.height - viewHeight;
      
      let fraction = scrollOffset / totalScrollable;
      fraction = Math.max(0, Math.min(fraction, 1));

      // Scrub the video to the calculated time
      video.currentTime = fraction * video.duration;
      setScrollProgress(fraction);
    };

    video.addEventListener('loadedmetadata', updateTrackHeight);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateTrackHeight);

    // Initial check in case metadata is already cached/loaded
    if (video.readyState >= 1) updateTrackHeight();

    return () => {
      video.removeEventListener('loadedmetadata', updateTrackHeight);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateTrackHeight);
    };
  }, [showEnvelope, isVideoReady]);

  return (
    <main className="relative min-h-screen w-full bg-[#fdf8f4] overflow-x-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} loop>
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
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Ambient Background Effects */}
            <FloatingPetals />

            {/* Scroll-Driven Video Section */}
            <section ref={scrollTrackRef} className="relative w-full">
              {/* Sticky container pins the video to the screen */}
              <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  playsInline
                  muted
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                
                {/* Visual Overlay: Appears only at the start to guide the user */}
                <div 
                  className="relative z-10 text-center pointer-events-none transition-opacity duration-700"
                  style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-4"
                  >
                    <h2 className="text-white text-3xl md:text-5xl font-extralight tracking-[0.3em] uppercase drop-shadow-lg">
                      Our Journey
                    </h2>
                    <p className="text-white/70 text-sm tracking-widest animate-bounce uppercase">
                      Scroll to begin
                    </p>
                  </motion.div>
                </div>

                {/* Loading state for the video */}
                {!isVideoReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-stone-100 z-50">
                    <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </section>

            {/* Main Invitation Content: Only visible after scrolling through the video */}
            <div className="relative z-20 bg-[#fdf8f4] shadow-[0_-40px_60px_rgba(0,0,0,0.15)]">
              <WeddingDetails />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Control Toggle */}
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
          className="fixed bottom-6 right-6 z-[110] p-3 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 text-stone-600 shadow-lg"
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
          </div>
        </motion.button>
      )}
    </main>
  );
};

export default Index;
