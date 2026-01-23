import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Envelope from '../components/Envelope';
import FloatingPetals from '../components/FloatingPetals';
import { WeddingDetails } from '../components/WeddingDetails';

// Use public path for more reliable production loading
const headerVideo = '/Header.mp4';

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
  const isUnlockedRef = useRef(false); // Track if video is unlocked for scrubbing

  // Configuration for the scroll scrub
  const pixelsPerSecond = 1000;
  const lerpFactor = 0.08; // Smoothness factor (lower = smoother but slower)

  // Lerp helper for smooth interpolation
  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

  const handleOpen = () => {
    // Unlock video playback on first user interaction (required by mobile browsers)
    if (videoRef.current) {
      const video = videoRef.current;
      video.muted = true;
      video.playsInline = true;
      
      // Chrome-specific fix: Play and immediately pause to unlock seeking
      video.play().then(() => {
        video.pause();
        video.currentTime = 0;
        isUnlockedRef.current = true;
        console.log("Video unlocked for scrubbing");
      }).catch((err) => {
        console.warn("Play failed, trying fallback:", err);
        // Fallback: force a frame update
        video.currentTime = 0.001;
        setTimeout(() => {
          video.currentTime = 0;
          isUnlockedRef.current = true;
        }, 100);
      });
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

        // Only mark "ready" once we truly know duration
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
        pendingFractionRef.current = fraction;
        
        // Chrome requires readyState >= 2 (HAVE_CURRENT_DATA) for reliable seeking
        if (video.readyState < 2) {
          console.log("Video not ready for seeking, readyState:", video.readyState);
          return;
        }
        
        // Only control playback after video is unlocked
        if (!isUnlockedRef.current) {
          console.log("Video not unlocked yet");
          return;
        }
        
        const duration = getDuration();
        if (!duration) {
          console.log("Duration not available yet");
          return;
        }
        
        const targetTime = Math.max(0, Math.min(duration - 0.05, fraction * duration));
        
        // Chrome fix: Use a slightly larger threshold to avoid excessive seeking
        if (Math.abs(video.currentTime - targetTime) > 0.05) {
          try {
            video.currentTime = targetTime;
          } catch (err) {
            console.warn("Seek failed:", err);
          }
        }
      };

      const handleLoadedMetadata = () => {
        console.log("metadata ready", { 
          readyState: video.readyState, 
          duration: video.duration,
          seekable: video.seekable?.length 
        });
        
        const duration = getDuration();
        if (duration > 0) {
          videoDurationRef.current = duration;
        }

        // Ensure we're in a paused state
        video.pause();

        updateTrackHeight();
        
        // Sync to current scroll position after metadata loads
        handleScroll();

        if (pendingFractionRef.current != null && getDuration() > 0) {
          syncVideoToFraction(pendingFractionRef.current);
        }

        setIsVideoReady(true);
      };

      // Chrome-specific: Handle when enough data is loaded
      const handleCanPlay = () => {
        console.log("Video can play, readyState:", video.readyState);
        updateTrackHeight();
        
        // Retry sync if we have a pending fraction
        if (pendingFractionRef.current != null) {
          syncVideoToFraction(pendingFractionRef.current);
        }
      };

      // Define handleScroll before it's used
      const handleScroll = () => {
        const trackElement = track as HTMLElement;
        const rect = trackElement.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        // Calculate scroll progress based on how far we've scrolled through the track
        const scrollOffset = -rect.top;
        const totalScrollable = trackElement.offsetHeight - viewHeight;
        
        if (totalScrollable <= 0) return;

        let fraction = scrollOffset / totalScrollable;
        fraction = Math.max(0, Math.min(fraction, 1));

        targetFractionRef.current = fraction;
        setScrollProgress(fraction);
      };

      const primeVideo = async () => {
        // Skip if already unlocked by user interaction
        if (isUnlockedRef.current) return;
        
        console.log("Priming video for Chrome compatibility");
        
        try {
          video.muted = true;
          video.playsInline = true;
          
          // Chrome requires actual play() to unlock seeking
          const playPromise = video.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log("Video played successfully");
            
            // Wait a bit for Chrome to fully initialize
            await new Promise(resolve => setTimeout(resolve, 100));
            
            video.pause();
            video.currentTime = 0;
            isUnlockedRef.current = true;
            console.log("Video primed and ready for scrubbing");
          }
        } catch (err) {
          console.warn("Autoplay blocked, waiting for user interaction:", err);
          // Don't mark as unlocked - wait for actual user interaction
        }
      };

      const unlockOnFirstInteraction = () => {
        if (!videoRef.current || isUnlockedRef.current) return;

        console.log("Unlocking video on user interaction");
        const video = videoRef.current;
        video.muted = true;
        video.playsInline = true;

        video.play()
          .then(() => {
            video.pause();
            video.currentTime = 0;
            isUnlockedRef.current = true;
            console.log("Video unlocked via user interaction");
            
            // Immediately sync to current scroll position
            syncVideoToFraction(targetFractionRef.current);
          })
          .catch((err) => {
            console.warn("Play on interaction failed:", err);
            video.currentTime = 0.001;
            isUnlockedRef.current = true;
          });

        // Remove all interaction listeners
        window.removeEventListener("click", unlockOnFirstInteraction);
        window.removeEventListener("scroll", unlockOnFirstInteraction);
        window.removeEventListener("touchstart", unlockOnFirstInteraction);
      };

      // Chrome fix: Listen for multiple interaction types
      window.addEventListener("click", unlockOnFirstInteraction, { once: true });
      window.addEventListener("scroll", unlockOnFirstInteraction, { once: true });
      window.addEventListener("touchstart", unlockOnFirstInteraction, { once: true });

      // RAF loop for smooth video scrubbing
      const animate = () => {
        const current = currentFractionRef.current;
        const target = targetFractionRef.current;
        
        // Only update if there's meaningful difference
        if (Math.abs(target - current) > 0.0001) {
          const newFraction = lerp(current, target, lerpFactor);
          currentFractionRef.current = newFraction;
          syncVideoToFraction(newFraction);
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Attach listeners with Chrome-specific handlers
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('loadeddata', handleLoadedMetadata);
      video.addEventListener('durationchange', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('canplaythrough', handleCanPlay);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', updateTrackHeight);
      
      // Fire initial scroll handler to sync video on load
      handleScroll();

      // Chrome fix: Explicitly load the video
      video.load();
      
      // Try to prime the video (may be blocked by autoplay policy)
      primeVideo();
      
      // Start the animation loop
      animationFrameRef.current = requestAnimationFrame(animate);

      if (video.readyState >= 1) {
        handleLoadedMetadata();
      } else {
        updateTrackHeight();
      }

      // Always unstick the UI even if media events never fire
      const safetyTimeout = window.setTimeout(() => {
        setIsVideoReady(true);
        console.log("Safety timeout reached, showing UI");
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
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateTrackHeight);
        window.removeEventListener("click", unlockOnFirstInteraction);
        window.removeEventListener("scroll", unlockOnFirstInteraction);
        window.removeEventListener("touchstart", unlockOnFirstInteraction);
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

      {/* Video Layer - Chrome fix: add key attributes */}
      {!showEnvelope && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <video
            ref={videoRef}
            src={headerVideo}
            muted
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
            style={{ willChange: 'auto' }}
          />
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
            {/* Ambient Background */}
            <FloatingPetals />

            {/* Cinematic Scrubber Section */}
            <section ref={scrollTrackRef} className="relative w-full">
              {/* Sticky container for scroll tracking */}
              <div className="sticky top-0 h-screen w-full z-0 pointer-events-none" />

              {/* Overlay Container - Also sticky to layer on top of video */}
              <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden -mt-[100vh]">
                
                {/* Scroll Prompt Overlay */}
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
            <div className="relative z-20 bg-[#fdf8f4] shadow-[0_-40px_60px_rgba(0,0,0,0.15)] overflow-hidden">
              {/* Floating hearts for this section */}
              <div className="absolute inset-0 pointer-events-none z-30">
                <FloatingPetals />
              </div>
              <WeddingDetails isVisible={!showEnvelope} />
            </div>
          </div>
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
