import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import photos
import parisPhoto from '@/assets/photos/paris.jpeg';
import annecyPhoto from '@/assets/photos/annecy.jpeg';
import engagementPhoto from '@/assets/photos/engagement.jpeg';
import beachSunsetPhoto from '@/assets/photos/beach-sunset.jpeg';
import mountainsPhoto from '@/assets/photos/mountains.jpeg';
import netherlandsPhoto from '@/assets/photos/netherlands.jpeg';

const photos = [
  engagementPhoto,
  parisPhoto,
  annecyPhoto,
  beachSunsetPhoto,
  mountainsPhoto,
  netherlandsPhoto,
];

export const ScrollPhotoSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress through the container
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - containerTop) / (containerHeight + viewportHeight)
      ));
      
      // Map scroll progress to photo index
      const newIndex = Math.min(
        photos.length - 1,
        Math.floor(scrollProgress * photos.length)
      );
      
      setCurrentIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-muted/30"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={photos[currentIndex]}
          alt={`Wedding photo ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      
      {/* Photo indicator dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {photos.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
