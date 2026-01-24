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
    const detailsContent = document.querySelector('[data-details-content]');
    if (!detailsContent) return;

    const handleScroll = () => {
      const scrollTop = detailsContent.scrollTop;
      const scrollHeight = detailsContent.scrollHeight - detailsContent.clientHeight;
      
      // Progress from 0 to 1 based on scroll position within the right column
      const scrollProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      
      // Map scroll progress to photo index
      const newIndex = Math.min(
        photos.length - 1,
        Math.floor(scrollProgress * photos.length)
      );
      
      setCurrentIndex(newIndex);
    };

    detailsContent.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => detailsContent.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-muted/30"
    >
      {/* Render all photos stacked, only current one is visible */}
      {photos.map((photo, index) => (
        <motion.img
          key={index}
          src={photo}
          alt={`Wedding photo ${index + 1}`}
          initial={false}
          animate={{ 
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.05
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1]
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ))}
      
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
