import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Envelope from '../components/Envelope';
import FloatingPetals from '../components/FloatingPetals';
import { WeddingDetails } from '../components/WeddingDetails';

// Use public path for more reliable production loading
const headerVideo = '/Header_chrome.mp4';

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

  // Keep these out of state to avoid rerenders during scroll
  const videoDurationRef = useRef(0);
  const pendingFractionRef = useRef<number | null>(null);
  
  // RAF-based smooth scrubbing refs
  const targetFractionRef = useRef(0);
  const currentFractionRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isUnlockedRef = useRef(false);
  const seekingRef = useRef(false); // Track if currently seeking

  // Configuration for the scroll scrub
  const pixelsPerSecond = 1000;
  const lerpFactor = 0.08;

  // Lerp helper for smooth interpolation
  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

  const handleOpen = () => {
    // CRITICAL: Chrome needs immediate play/pause on user gesture
    if (videoRef.current) {
      const video = videoRef.current;
      video.muted = true;
      video.playsInline = true;
      
      // Chrome MUST have play() called during user gesture
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Successfully started playing
          setTimeout(() => {
            video.pause();
            video.currentTime = 0;
            isUnlockedRef.current = true;
            console.log("✓ Chrome: Video unlocked");
          }, 50);
        }).catch((err) => {
          console.error("Chrome play failed:", err);
          isUnlockedRef.current = true; // Try anyway
        });
      }
    }
    
    setShowEnvelope(false);
  };

  useEffect(() => {
    if (showEnvelope) return;

    let rafId = 0;
    let cleanup: (() => void) | null = null;

    const initWhenMounted = () => {
      const video = videoRef.current;
      const track = scrollTrackRef.current;
      if (!video || !track) {
        rafId = window.requestAnimationFrame(initWhenMounted);
        return;
      }

      // Forces a height for the scroll track based on video duration
      const updateTrackHeight = () => {
        const duration = videoDurationRef.current || (Number.isFinite(video.duration) ? video.duration : 0) || 5;
        const trackHeight = window.innerHeight + (duration * pixelsPerSecond);
        (track as HTMLElement).style.height = `${trackHeight}px`;

        if ((videoDurationRef.current || video.duration) > 0) {
          setIsVideoReady(true);
        }
      };

      const getDuration = () => {
        const d = videoDurationRef.current || (Number.isFinite(video.duration) ? video.duration : 0);
        if (d > 0) return d;
        if (video.seekable?.length) {
          const seekableEnd = video.seekable.end(video.seekable.length - 1);
          if (Number.isFinite(seekableEnd) && seekableEnd > 0) return seekableEnd;
        }
        return 0;
      };

      const syncVideoToFraction = (fraction: number) => {
        if (!video || seekingRef.current) return;
        
        pendingFractionRef.current = fraction;
        
        // Chrome CRITICAL: Must check multiple readyState conditions
        const ready = video.readyState >= 2; // HAVE_CURRENT_DATA minimum
        const hasMetadata = video.readyState >= 1; // HAVE_METADATA
        
        if (!ready) {
          console.log("Chrome: Video not ready, state:", video.readyState);
          return;
        }
        
        if (!isUnlockedRef.current) {
          console.log("Chrome: Video not unlocked");
          return;
        }
        
        const duration = getDuration();
        if (!duration || duration <= 0) {
          console.log("Chrome: No duration", duration);
          return;
        }
        
        const targetTime = Math.max(0, Math.min(duration - 0.1, fraction * duration));
        
        // Chrome-specific: Bigger threshold to reduce seeking frequency
        if (Math.abs(video.currentTime - targetTime) > 0.1) {
          try {
            seekingRef.current = true;
            video.currentTime = targetTime;
            console.log("Chrome: Seeking to", targetTime.toFixed(2));
          } catch (err) {
            console.error("Chrome: Seek error", err);
            seekingRef.current = false;
          }
        }
      };

      // Chrome: Handle seeking events
      const handleSeeking = () => {
        console.log("Chrome: Seeking...");
      };

      const handleSeeked = () => {
        console.log("Chrome: Seeked complete");
        seekingRef.current = false;
        
        // Re-sync if target changed during seek
        if (pendingFractionRef.current !== null) {
          const currentTarget = targetFractionRef.current;
          const duration = getDuration();
          if (duration > 0) {
            const expectedTime = currentTarget * duration;
            if (Math.abs(video.currentTime - expectedTime) > 0.15) {
              setTimeout(() => syncVideoToFraction(currentTarget), 10);
            }
          }
        }
      };

      const handleLoadedMetadata = () => {
        console.log("Chrome: metadata loaded", { 
          readyState: video.readyState, 
          duration: video.duration,
          seekable: video.seekable?.length 
        });
        
        const duration = getDuration();
        if (duration > 0) {
          videoDurationRef.current = duration;
        }

        video.pause();
        updateTrackHeight();
        handleScroll();

        if (pendingFractionRef.current != null && getDuration() > 0) {
          setTimeout(() => syncVideoToFraction(pendingFractionRef.current!), 100);
        }

        setIsVideoReady(true);
      };

      const handleCanPlay = () => {
        console.log("Chrome: Can play, readyState:", video.readyState);
        updateTrackHeight();
        
        // Retry pending sync
        if (pendingFractionRef.current != null && isUnlockedRef.current) {
          setTimeout(() => syncVideoToFraction(pendingFractionRef.current!), 50);
        }
      };

      const handleScroll = () => {
        const trackElement = track as HTMLElement;
        const rect = trackElement.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        const scrollOffset = -rect.top;
        const totalScrollable = trackElement.offsetHeight - viewHeight;
        
        if (totalScrollable <= 0) return;

        let fraction = scrollOffset / totalScrollable;
        fraction = Math.max(0, Math.min(fraction, 1));

        targetFractionRef.current = fraction;
        setScrollProgress(fraction);
      };

      // Chrome: Aggressive unlock strategy
      const unlockVideo = async () => {
        if (isUnlockedRef.current) return;
        
        console.log("Chrome: Attempting unlock...");
        
        try {
          video.muted = true;
          video.playsInline = true;
          video.volume = 0;
          
          // Chrome MUST play during user gesture
          await video.play();
          console.log("Chrome: Play started");
          
          // Give Chrome time to initialize
          await new Promise(resolve => setTimeout(resolve, 150));
          
          video.pause();
          console.log("Chrome: Paused");
          
          // Try a small seek to verify it works
          video.currentTime = 0.01;
          await new Promise(resolve => setTimeout(resolve, 50));
          video.currentTime = 0;
          
          isUnlockedRef.current = true;
          console.log("Chrome: ✓ UNLOCKED");
          
          // Immediately sync to scroll position
          setTimeout(() => {
            syncVideoToFraction(targetFractionRef.current);
          }, 50);
          
        } catch (err) {
          console.error("Chrome: Unlock failed:", err);
          // Mark as unlocked anyway, might work
          isUnlockedRef.current = true;
        }
      };

      // Chrome: Listen for ANY user interaction
      const onFirstInteraction = (e: Event) => {
        console.log("Chrome: User interaction detected:", e.type);
        unlockVideo();
      };

      // Add listeners for all interaction types
      const events = ['click', 'scroll', 'touchstart', 'mousedown', 'keydown', 'wheel'];
      events.forEach(eventType => {
        window.addEventListener(eventType, onFirstInteraction, { once: true, passive: true });
      });

      // RAF loop for smooth video scrubbing
      const animate = () => {
        const current = currentFractionRef.current;
        const target = targetFractionRef.current;
        
        if (Math.abs(target - current) > 0.0001 && !seekingRef.current) {
          const newFraction = lerp(current, target, lerpFactor);
          currentFractionRef.current = newFraction;
          syncVideoToFraction(newFraction);
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Attach all event listeners
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('loadeddata', handleLoadedMetadata);
      video.addEventListener('durationchange', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('canplaythrough', handleCanPlay);
      video.addEventListener('seeking', handleSeeking);
      video.addEventListener('seeked', handleSeeked);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', updateTrackHeight);
      
      handleScroll();

      // Chrome: Force load
      video.load();
      
      // Start animation loop
      animationFrameRef.current = requestAnimationFrame(animate);

      if (video.readyState >= 1) {
        handleLoadedMetadata();
      } else {
        updateTrackHeight();
      }

      const safetyTimeout = window.setTimeout(() => {
        setIsVideoReady(true);
        console.log("Chrome: Safety timeout - showing UI");
      }, 3500);

      cleanup = () => {
        window.clearTimeout(safetyTimeout);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('loadeddata', handleLoadedMetadata);
        video.removeEventListener('durationchange', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('canplaythrough', handleCanPlay);
        video.removeEventListener('seeking', handleSeeking);
        video.removeEventListener('seeked', handleSeeked);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateTrackHeight);
        
        events.forEach(eventType => {
          window.removeEventListener(eventType, onFirstInteraction);
        });
      };
    };

    initWhenMounted();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      cleanup?.();
    };
  }, [showEnvelope]);

  return (
    <main className="relative min-h-screen w-full bg-[#fdf8f4]">
      <audio ref={audioRef} loop>
        <source src="/open.mp3" type="audio/mpeg" />
      </audio>

      {!showEnvelope && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src={headerVideo} type="video/mp4" />
          </video>
        </div>
      )}

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
                    className="space-y-2"
                  >
                    <p className="text-white text-lg md:text-xl font-extralight tracking-[0.3em] uppercase drop-shadow-xl">
                      08.08.2026
                    </p>
                    <h2 className="text-white text-3xl md:text-5xl font-extralight tracking-[0.3em] uppercase drop-shadow-xl">
                      You're Cordially Invited
                    </h2>
                    <p className="text-white/70 text-sm tracking-widest animate-bounce uppercase">
                      Scroll to reveal
                    </p>
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
                        <span className="text-xs uppercase tracking-widest text-stone-400">Preparing cinematic...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <div className="relative z-20 bg-[#fdf8f4] shadow-[0_-40px_60px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none z-30">
                <FloatingPetals />
              </div>
              <WeddingDetails isVisible={!showEnvelope} />
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
