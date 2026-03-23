import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScratchCard from './ScratchCard';

interface ScratchEnvelopePageProps {
  imageSrc: string;
}

export default function ScratchEnvelopePage({ imageSrc }: ScratchEnvelopePageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Allow scratch interaction once the card has emerged
    window.setTimeout(() => setCardReady(true), 2000);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#edf5ff] px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(214,231,255,0.7),transparent_45%)]" />

      <div className="relative flex flex-col items-center">
        {/* Scratch card emerging from envelope */}
        <div className="relative z-10">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ y: 160, opacity: 0, scale: 0.88 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <ScratchCard imageSrc={imageSrc} interactive={cardReady} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Envelope underneath */}
        <motion.div
          animate={{
            y: isOpen ? 20 : 0,
            scale: isOpen ? 0.85 : 1,
            opacity: isOpen ? 0.7 : 1,
          }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          className="relative w-full max-w-[340px] md:max-w-[400px] aspect-[4/3]"
          style={{ marginTop: isOpen ? -60 : 0 }}
        >
          <div className="absolute bottom-10 left-1/2 h-12 w-[82%] -translate-x-1/2 rounded-full bg-[#9abbe2]/30 blur-2xl" />

          {/* Envelope body */}
          <div className="absolute inset-0 rounded-md border border-[#bdd5ef] bg-[#e9f3ff] shadow-[0_25px_45px_rgba(120,156,199,0.25)]" />

          {/* Side and bottom flaps */}
          <div className="absolute inset-y-0 left-0 z-10 w-1/2 rounded-l-md bg-[#deecfb] [clip-path:polygon(0%_0%,0%_100%,100%_50%)]" />
          <div className="absolute inset-y-0 right-0 z-10 w-1/2 rounded-r-md bg-[#d6e7fa] [clip-path:polygon(100%_0%,100%_100%,0%_50%)]" />
          <div className="absolute bottom-0 left-0 right-0 z-20 h-[57%] bg-[#cfe1f7] [clip-path:polygon(0%_100%,100%_100%,50%_0%)]" />

          {/* Top flap with 3D rotation */}
          <motion.div
            animate={{ rotateX: isOpen ? -178 : 0 }}
            transition={{ duration: 0.72, ease: 'easeInOut' }}
            className="absolute left-0 right-0 top-0 z-30 h-[57%] origin-top [transform-style:preserve-3d]"
            style={{ clipPath: 'polygon(0% 0%,100% 0%,50% 100%)' }}
          >
            <div className="absolute inset-0 bg-[#c8dcf5]" />
            <div
              className="absolute inset-0 [backface-visibility:hidden]"
              style={{ transform: 'rotateX(180deg)' }}
            >
              <div className="absolute inset-0 bg-[#e4f0ff]" />
            </div>
          </motion.div>

          {/* Wax seal button */}
          <AnimatePresence>
            {!isOpen && (
              <motion.button
                type="button"
                onClick={handleOpen}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="absolute left-[42%] top-[42%] z-50 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                <img
                  src="/waxseal.png"
                  alt="Wax seal"
                  className="h-24 w-24 object-contain md:h-32 md:w-32"
                />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {!cardReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-7 text-center"
          >
            <p className="text-[#406085] text-sm font-semibold uppercase tracking-[0.3em] md:text-base">
              {isOpen ? 'Opening...' : 'Click the wax seal to open'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
