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
  const videoSrc = "/Header.mp4"; 
  const pixelsPerSecond = 1000; 

  const handleOpen = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio blocked", err));
    }
    setShowEnvelope(false);
  };

  useEffect(() => {
    // We only initialize the video logic once the envelope is opened
    if (showEnvelope) return;

    const video = videoRef.current;
    const track = scrollTrackRef.current;
    if (!video || !track) return;

    // Forces a height for the scroll track based on video duration
    const updateTrackHeight = () => {
      const duration = video.duration || 5; // Default to 5s if metadata is slightly delayed
      const trackHeight = window.innerHeight + (duration * pixelsPerSecond);
      track.style.height = `${trackHeight}px`;
      
      // Once metadata is loaded, we can mark the video as ready to scrub
      if (video.duration > 0) {
        setIsVideoReady(true);
      }
    };

    const handleScroll = () => {
      const duration = video.duration;
      if (!duration || isNaN(duration)) return;

      const rect = track.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // Calculate progress (0 to 1) based on track position relative to viewport
      // rect.top will be negative as we scroll down the track
      const scrollOffset = -rect.top;
      const totalScrollable = rect.height - viewHeight;
      
      if (totalScrollable <= 0) return;

      let fraction = scrollOffset / totalScrollable;
      fraction = Math.max(0, Math.min(fraction, 1));

      // Synchronize video time to scroll fraction
      video.currentTime = fraction * duration;
      setScrollProgress(fraction);
    };

    // Attach listeners
    video.addEventListener('loadedmetadata', updateTrackHeight);
    video.addEventListener('canplay', updateTrackHeight);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateTrackHeight);

    // Fallback: If metadata is already ready or cached
    if (video.readyState >= 1) {
      updateTrackHeight();
    }

    // Safety Timeout: If for some reason metadata/canplay doesn't fire, 
    // hide the loading screen after 3 seconds anyway to allow user access.
    const safetyTimeout = setTimeout(() => {
      setIsVideoReady(true);
    }, 3000);

    return () => {
      clearTimeout(safetyTimeout);
      video.removeEventListener('loadedmetadata', updateTrackHeight);
      video.removeEventListener('canplay', updateTrackHeight);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateTrackHeight);
    };
  }, [showEnvelope]);

  return (
    <main className="relative min-h-screen w-full bg-[#fdf8f4] overflow-x-hidden">
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
            {/* Ambient Background */}
            <FloatingPetals />

            {/* Cinematic Scrubber Section */}
            <section ref={scrollTrackRef} className="relative w-full">
              <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  playsInline
                  muted
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                
                {/* Scroll Prompt Overlay */}
                <div 
                  className="relative z-10 text-center pointer-events-none transition-opacity duration-700"
                  style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-4"
                  >
                    <h2 className="text-white text-3xl md:text-5xl font-extralight tracking-[0.3em] uppercase drop-shadow-xl">
                      Our Journey
                    </h2>
                    <p className="text-white/70 text-sm tracking-widest animate-bounce uppercase">
                      Scroll to begin
                    </p>
                  </motion.div>
                </div>

                {/* Video Loading State Overlay */}
                <AnimatePresence>
                  {!isVideoReady && (
                    <motion.div 
                      key="loading-overlay"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-[#fdf8f4] z-50"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                        <span className="text-xs uppercase tracking-widest text-stone-400">Preparing cinematic...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Wedding Details Reveal */}
            <div className="relative z-20 bg-[#fdf8f4] shadow-[0_-40px_60px_rgba(0,0,0,0.15)]">
              <WeddingDetails isVisible={!showEnvelope} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Control */}
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
