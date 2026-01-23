import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Envelope from '../components/Envelope';
import FloatingPetals from '../components/FloatingPetals';
import { WeddingDetails } from '../components/WeddingDetails';

// Reference the video in the public folder
const headerVideo = '/header.mp4';

/**
 * Main Index Page
 * Coordinates the transition between the Envelope, the Scroll-Driven Video, and Wedding Details.
 */
const Index = () => {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollTrackRef = useRef<HTMLElement | null>(null);

  // Use refs for values that change rapidly during scroll to avoid unnecessary re-renders
  const videoDurationRef = useRef(0);
  const pendingFractionRef = useRef<number | null>(null);
  
  // Smooth scrubbing refs using RequestAnimationFrame
  const targetFractionRef = useRef(0);
  const currentFractionRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isUnlockedRef = useRef(false);

  // Scrubbing configuration
  const pixelsPerSecond = 1000;
  const lerpFactor = 0.08;

  /**
   * Smooth scrubbing loop
   */
  const scrubLoop = () => {
    if (!videoRef.current || !videoDurationRef.current) return;

    // Linear interpolation for smooth movement
    currentFractionRef.current += (targetFractionRef.current - currentFractionRef.current) * lerpFactor;
    const diff = Math.abs(targetFractionRef.current - currentFractionRef.current);
    
    // Update video current time
    videoRef.current.currentTime = currentFractionRef.current * videoDurationRef.current;
    
    // Update scroll progress state for UI overlays
    setScrollProgress(currentFractionRef.current);

    if (diff > 0.0001) {
      animationFrameRef.current = requestAnimationFrame(scrubLoop);
    } else {
      animationFrameRef.current = null;
    }
  };

  /**
   * Handle scroll events to calculate the target video fraction
   */
  const handleScroll = () => {
    if (!scrollTrackRef.current || showEnvelope) return;

    const rect = scrollTrackRef.current.getBoundingClientRect();
    const scrollHeight = rect.height - window.innerHeight;
    const scrolled = -rect.top;

    if (scrollHeight <= 0) return;

    const fraction = Math.max(0, Math.min(1, scrolled / scrollHeight));
    targetFractionRef.current = fraction;

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(scrubLoop);
    }
  };

  /**
   * Initial Setup: Manage video metadata and pre-loading
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      videoDurationRef.current = video.duration;
      setIsVideoReady(true);
      if (pendingFractionRef.current !== null) {
        video.currentTime = pendingFractionRef.current * video.duration;
        pendingFractionRef.current = null;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video.readyState >= 1) handleLoadedMetadata();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  /**
   * Attach scroll listener only when the invitation is opened
   */
  useEffect(() => {
    if (!showEnvelope) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Check position immediately
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showEnvelope]);

  /**
   * Chrome Stability Fix:
   * Browsers (especially Chrome) often suspend video playback in inactive tabs.
   * This ensures the video remains "active" so currentTime updates work when the user scrolls back.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && videoRef.current && !showEnvelope) {
        // Calling play() clears browser-imposed suspensions on background elements
        videoRef.current.play().catch(() => {
          // Failure to play here is non-critical as we use currentTime for scrubbing
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [showEnvelope]);

  /**
   * Transition from Envelope to the main invitation
   */
  const onOpenEnvelope = () => {
    setShowEnvelope(false);
    
    // Play the background music
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }

    // CRITICAL CHROME FIX: 
    // Programmatically "unlock" the video playback. Chrome requires a user interaction 
    // (the open click) to allow video manipulation. By calling play() and then pause(), 
    // we signal that the video is active, allowing subsequent manual currentTime updates.
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          videoRef.current?.pause();
          isUnlockedRef.current = true;
        })
        .catch(e => console.log("Video interaction required for scrubbing in this browser", e));
    }
  };

  return (
    <div className="relative min-h-screen bg-stone-50 overflow-x-hidden selection:bg-rose-100 selection:text-rose-900">
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src="/open.mp3" 
        loop 
        preload="auto"
      />

      <AnimatePresence mode="wait">
        {showEnvelope ? (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fdfbf7]"
          >
            <Envelope onOpen={onOpenEnvelope} />
          </motion.div>
        ) : (
          <div key="scroll-view" className="relative w-full">
            {/* Scroll-driven video section */}
            <section 
              ref={scrollTrackRef}
              style={{ height: `${(videoDurationRef.current || 5) * pixelsPerSecond}px` }}
              className="relative w-full"
            >
              <div className="sticky top-0 h-screen w-full overflow-hidden bg-stone-900">
                <video
                  ref={videoRef}
                  src={headerVideo}
                  muted
                  playsInline
                  autoPlay
                  loop
                  preload="auto"
                  className="h-full w-full object-cover opacity-80 scale-[1.01]"
                />

                {/* Aesthetic gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                {/* Hero Text Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <motion.div
                    style={{ 
                      opacity: 1 - scrollProgress * 4, // Fades out early in the scroll
                      y: -scrollProgress * 200
                    }}
                    className="text-center"
                  >
                    <span className="inline-block mb-4 text-xs font-light tracking-[0.4em] uppercase text-stone-200">
                      You are cordially invited
                    </span>
                    <h1 className="text-5xl md:text-8xl font-thin tracking-tighter mb-4 italic">
                      The Nuptials of
                    </h1>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Main Details and RSVP area */}
            <div className="relative z-20 bg-[#fdfbf7] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
              <div className="absolute inset-0 pointer-events-none z-30">
                <FloatingPetals />
              </div>
              <WeddingDetails isVisible={!showEnvelope} />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Music Toggle */}
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
    </div>
  );
};

export default Index;
