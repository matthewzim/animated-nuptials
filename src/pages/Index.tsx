import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Envelope from '../components/Envelope';
import { WeddingDetails } from '../components/WeddingDetails';

const headerVideo = '/Header_chrome.mp4';

interface IndexProps {
  onMusicStart?: () => void;
}

/**
 * Main Index Page
 * 3-stage flow: Envelope → Video → Wedding Details
 */
const Index = ({ onMusicStart }: IndexProps) => {
  const [stage, setStage] = useState<'envelope' | 'video' | 'details'>('envelope');

  const handleEnvelopeOpen = () => {
    setStage('video');
    onMusicStart?.();
  };

  const handleContinue = () => {
    setStage('details');
  };

  return (
    <main className="relative min-h-screen w-full bg-[#fdf8f4]">
      <AnimatePresence mode="wait">
        {/* Stage 1: Envelope */}
        {stage === 'envelope' && (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fdf8f4]"
          >
            <Envelope onOpen={handleEnvelopeOpen} />
          </motion.div>
        )}

        {/* Stage 2: Video Intro */}
        {stage === 'video' && (
          <motion.div
            key="video-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] cursor-pointer"
            onClick={handleContinue}
          >
            {/* Full-screen Video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={headerVideo} type="video/mp4" />
            </video>

            {/* Overlay Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="text-center space-y-4">
                <p className="text-white text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase drop-shadow-xl">
                  08.08.2026
                </p>
                <h2 className="font-serif text-white text-4xl md:text-6xl font-bold tracking-[0.3em] uppercase drop-shadow-xl">
                  You're Cordially Invited
                </h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-white/90 text-lg md:text-xl font-bold tracking-[0.2em] uppercase mt-8 drop-shadow-lg"
                >
                  Click to Continue
                </motion.p>
              </div>
            </motion.div>

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
          </motion.div>
        )}

        {/* Stage 3: Wedding Details */}
        {stage === 'details' && (
          <motion.div
            key="details-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative z-20 bg-[#fdf8f4]">
              <WeddingDetails isVisible={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Index;
