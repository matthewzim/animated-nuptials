import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Index from "./pages/Index";
import RSVP from "./pages/RSVP";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicStarted, setMusicStarted] = useState(false);

  const startMusic = () => {
    if (audioRef.current && !musicStarted) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(console.error);
      setMusicStarted(true);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Global Audio Player */}
        <audio ref={audioRef} loop muted>
          <source src="/open.mp3" type="audio/mpeg" />
        </audio>

        {/* Music Control Button - visible after music starts */}
        {musicStarted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
            onClick={toggleMusic}
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

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index onMusicStart={startMusic} />} />
            <Route path="/rsvp" element={<RSVP />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
