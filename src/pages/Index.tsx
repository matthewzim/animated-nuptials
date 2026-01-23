import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Optimized Video Scrubbing Component for Chrome/Safari Compatibility
 * * FIXES: 
 * 1. Seek-locking (isSeekingRef) to prevent Chrome from queuing too many currentTime updates.
 * 2. Interaction-based unlocking (play().then(pause)) to activate the media pipeline.
 * 3. ReadyState guards to prevent seeking before the buffer is ready.
 */

// Placeholder Components to ensure compilation in single-file environment
const Envelope = ({ onOpen }) => (
  <div className="flex flex-col items-center gap-8 cursor-pointer group" onClick={onOpen}>
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-64 h-44 bg-[#fdfaf6] border-2 border-stone-200 shadow-2xl rounded-sm flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 border-[10px] border-white/50 pointer-events-none" />
      <div className="text-stone-400 text-3xl">✉️</div>
      <div className="absolute bottom-4 text-[10px] uppercase tracking-[0.4em] text-stone-400">Open Invitation</div>
    </motion.div>
    <p className="text-stone-400 font-light tracking-widest uppercase text-xs animate-pulse">Click to open</p>
  </div>
);

const FloatingPetals = () => (
  <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          opacity: 0, 
          x: Math.random() * 100 + "%", 
          y: -20,
          rotate: 0 
        }}
        animate={{ 
          opacity: [0, 0.4, 0],
          y: "110vh",
          x: (Math.random() * 100 - 10) + "%",
          rotate: 360
        }}
        transition={{ 
          duration: 10 + Math.random() * 10, 
          repeat: Infinity, 
          delay: Math.random() * 10,
          ease: "linear"
        }}
        className="absolute w-4 h-4 bg-rose-100/40 rounded-full blur-[1px]"
      />
    ))}
  </div>
);

const WeddingDetails = ({ isVisible }) => (
  <section className="py-32 px-6 flex flex-col items-center text-center space-y-12">
    <div className="max-w-2xl space-y-6">
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-stone-600 text-sm tracking-[0.5em] uppercase"
      >
        The Celebration
      </motion.h3>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-6xl font-serif text-stone-800 italic"
      >
        Sarah & James
      </motion.h1>
      <div className="w-12 h-[1px] bg-rose-200 mx-auto" />
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-stone-500 leading-relaxed font-light text-lg"
      >
        Please join us for an evening of love, laughter, and celebration as we begin our new life together.
      </motion.p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl">
      <div className="space-y-2">
        <p className="uppercase tracking-widest text-xs text-stone-400">When</p>
        <p className="text-stone-700">August 08, 2026<br/>at 4:00 PM</p>
      </div>
      <div className="space-y-2">
        <p className="uppercase tracking-widest text-xs text-stone-400">Where</p>
        <p className="text-stone-700">The Glass House<br/>New York City</p>
      </div>
      <div className="space-y-2">
        <p className="uppercase tracking-widest text-xs text-stone-400">RSVP</p>
        <p className="text-stone-700 underline underline-offset-4 cursor-pointer">Kindly Reply by July 1st</p>
      </div>
    </div>
  </section>
);

const App = () => {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollTrackRef = useRef<HTMLElement | null>(null);

  const videoDurationRef = useRef(0);
  const targetFractionRef = useRef(0);
  const currentFractionRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isUnlockedRef = useRef(false); 
  const isSeekingRef = useRef(false);

  const headerVideo = '/Header.mp4';
  const pixelsPerSecond = 1000;
  const lerpFactor = 0.06;

  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

  const handleOpen = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.muted = true;
      video.playsInline = true;
      
      // Force activation for Chrome media pipeline
      video.play().then(() => {
        video.pause();
        isUnlockedRef.current = true;
        setIsVideoReady(true);
      }).catch(() => {
        video.currentTime = 0.001;
        isUnlockedRef.current = true;
      });
    }
    setShowEnvelope(false);
  };

  useEffect(() => {
    if (showEnvelope) return;

    let cleanup: (() => void) | null = null;

    const init = () => {
      const video = videoRef.current;
      const track = scrollTrackRef.current;
      if (!video || !track) return;

      const updateTrackHeight = () => {
        const d = videoDurationRef.current || (Number.isFinite(video.duration) ? video.duration : 0) || 5;
        const trackHeight = window.innerHeight + (d * pixelsPerSecond);
        (track as HTMLElement).style.height = `${trackHeight}px`;
        if (d > 0) setIsVideoReady(true);
      };

      const getDuration = () => {
        const d = videoDurationRef.current || (Number.isFinite(video.duration) ? video.duration : 0);
        if (d > 0) return d;
        if (video.seekable?.length) {
          const end = video.seekable.end(video.seekable.length - 1);
          return Number.isFinite(end) ? end : 0;
        }
        return 0;
      };

      const syncVideoToFraction = (fraction: number) => {
        // Guard for Chrome: don't seek if a seek is already in progress
        if (!video || video.readyState < 2 || !isUnlockedRef.current || isSeekingRef.current) return;

        const duration = getDuration();
        if (!duration) return;
        
        const targetTime = Math.max(0, Math.min(duration - 0.05, fraction * duration));
        
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          isSeekingRef.current = true;
          video.currentTime = targetTime;
        }
      };

      const handleSeeked = () => { isSeekingRef.current = false; };
      
      const handleLoadedMetadata = () => {
        const d = getDuration();
        if (d > 0) videoDurationRef.current = d;
        video.pause();
        updateTrackHeight();
        handleScroll();
        setIsVideoReady(true);
      };

      const handleScroll = () => {
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const scrollOffset = -rect.top;
        const totalScrollable = track.offsetHeight - window.innerHeight;
        if (totalScrollable <= 0) return;
        const fraction = Math.max(0, Math.min(scrollOffset / totalScrollable, 1));
        targetFractionRef.current = fraction;
        setScrollProgress(fraction);
      };

      const animate = () => {
        const current = currentFractionRef.current;
        const target = targetFractionRef.current;
        if (Math.abs(target - current) > 0.0001) {
          const next = lerp(current, target, lerpFactor);
          currentFractionRef.current = next;
          syncVideoToFraction(next);
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('seeked', handleSeeked);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', updateTrackHeight);
      
      video.load();
      animationFrameRef.current = requestAnimationFrame(animate);

      cleanup = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('seeked', handleSeeked);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateTrackHeight);
      };
    };

    const timer = setTimeout(init, 100);
    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [showEnvelope]);

  return (
    <main className="relative min-h-screen w-full bg-[#fdf8f4] text-stone-800 font-sans selection:bg-rose-100">
      <audio ref={audioRef} loop preload="auto">
        <source src="/open.mp3" type="audio/mpeg" />
      </audio>

      {!showEnvelope && (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#fdf8f4]">
          <video
            ref={videoRef}
            src={headerVideo}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover grayscale-[0.2] brightness-90"
          />
          <div className="absolute inset-0 bg-stone-900/10" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {showEnvelope ? (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fdf8f4]"
          >
            <Envelope onOpen={handleOpen} />
          </motion.div>
        ) : (
          <div key="main-content">
            <FloatingPetals />

            <section ref={scrollTrackRef} className="relative w-full">
              <div className="sticky top-0 h-screen w-full z-0 pointer-events-none" />
              <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden -mt-[100vh]">
                
                <div 
                  className="absolute top-1/4 left-0 right-0 z-10 text-center pointer-events-none transition-opacity duration-700"
                  style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-4"
                  >
                    <p className="text-white text-lg md:text-xl font-extralight tracking-[0.5em] uppercase drop-shadow-2xl">
                      August 08, 2026
                    </p>
                    <h2 className="text-white text-4xl md:text-6xl font-extralight tracking-[0.2em] uppercase drop-shadow-2xl">
                      Save The Date
                    </h2>
                  </motion.div>
                </div>

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
                        <span className="text-xs uppercase tracking-widest text-stone-400 font-light">Loading Cinematic Experience...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <div className="relative z-20 bg-[#fdf8f4] shadow-[0_-40px_60px_rgba(0,0,0,0.08)]">
              <WeddingDetails isVisible={!showEnvelope} />
              
              <footer className="py-20 text-center text-stone-400 text-[10px] tracking-[0.4em] uppercase">
                Forever & Always
              </footer>
            </div>
          </div>
        )}
      </AnimatePresence>

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
          className="fixed bottom-8 right-8 z-[110] w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-stone-200 text-stone-600 shadow-xl transition-all active:scale-90"
        >
          <div className="flex gap-1 items-end h-3">
            <motion.div animate={{ height: ["20%", "100%", "40%"] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[2px] bg-rose-300" />
            <motion.div animate={{ height: ["40%", "20%", "80%"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[2px] bg-rose-400" />
            <motion.div animate={{ height: ["60%", "100%", "20%"] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[2px] bg-rose-300" />
          </div>
        </motion.button>
      )}
    </main>
  );
};

export default App;
