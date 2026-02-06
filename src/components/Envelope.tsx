import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeProps {
  onOpen?: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    window.setTimeout(() => {
      onOpen?.();
    }, 2050);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#edf5ff] px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(214,231,255,0.7),transparent_45%)]" />

      <div className="relative w-full max-w-xl md:max-w-2xl aspect-[4/3]">
        <div className="absolute bottom-10 left-1/2 h-12 w-[82%] -translate-x-1/2 rounded-full bg-[#9abbe2]/30 blur-2xl" />

        <motion.div
          initial={false}
          animate={{ y: isOpen ? 55 : 0, scale: isOpen ? 0.98 : 1 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          className="relative h-full w-full"
        >
          <div className="absolute inset-0 rounded-md border border-[#bdd5ef] bg-[#e9f3ff] shadow-[0_25px_45px_rgba(120,156,199,0.25)]" />

          <div className="absolute inset-y-0 left-0 z-10 w-1/2 rounded-l-md bg-[#deecfb] [clip-path:polygon(0%_0%,0%_100%,100%_50%)]" />
          <div className="absolute inset-y-0 right-0 z-10 w-1/2 rounded-r-md bg-[#d6e7fa] [clip-path:polygon(100%_0%,100%_100%,0%_50%)]" />
          <div className="absolute bottom-0 left-0 right-0 z-20 h-[57%] bg-[#cfe1f7] [clip-path:polygon(0%_100%,100%_100%,50%_0%)]" />

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

          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ y: 30, opacity: 0.8, scale: 0.9 }}
                  animate={{ y: -188, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  className="absolute left-[7%] top-[13%] z-40 h-[82%] w-[86%] rounded-[2px] border border-[#e9edf3] bg-white shadow-[0_18px_35px_rgba(90,116,146,0.2)]"
                />

                <motion.div
                  initial={{ y: -188, opacity: 0.9, scale: 1, filter: 'blur(0px)' }}
                  animate={{ y: -196, opacity: 0, scale: 4.4, filter: 'blur(3px)' }}
                  transition={{ duration: 1.05, ease: [0.19, 1, 0.22, 1], delay: 0.8 }}
                  className="absolute left-[7%] top-[13%] z-[60] h-[82%] w-[86%] rounded-[2px] border border-[#f0f2f6] bg-white will-change-transform"
                />
              </>
            )}
          </AnimatePresence>

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
                className="absolute left-1/2 top-[55%] z-50 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                <img
                  src="/waxseal.png"
                  alt="Wax seal"
                  className="h-16 w-16 object-contain drop-shadow-[0_8px_10px_rgba(85,59,59,0.4)] md:h-20 md:w-20"
                />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-7 text-center">
        <p className="text-[#406085] text-sm font-semibold uppercase tracking-[0.3em] md:text-base">
          {isOpen ? 'Opening invitation...' : 'Click the wax seal to open'}
        </p>
        {!isOpen && (
          <p className="mt-2 text-xs font-medium tracking-[0.2em] text-[#406085]/80 md:text-sm">
            Turn on Sound
          </p>
        )}
      </motion.div>
    </div>
  );
}
