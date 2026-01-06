import { useRef, useEffect } from "react";
import { Calendar, MapPin, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeddingDetailsProps {
  isVisible: boolean;
}

export const WeddingDetails = ({ isVisible }: WeddingDetailsProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the video container is visible and scrolled past
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));
      
      // Map scroll progress to video time
      if (video.duration && !isNaN(video.duration)) {
        video.currentTime = scrollProgress * video.duration;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call to set position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  const details = [
    {
      icon: Calendar,
      title: "The Date",
      content: "August 8th, 2026",
      delay: "0.2s",
    },
    {
      icon: Clock,
      title: "The Time",
      content: "1:00 PM Arrival",
      delay: "0.4s",
    },
    {
      icon: MapPin,
      title: "The Venue",
      content: "UBC Botanical Garden",
      subContent: "6804 SW Marine Dr, Vancouver, BC V6T 2J9",
      delay: "0.6s",
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-8">
      {/* Header Video - Scroll Controlled */}
      <div 
        ref={containerRef}
        className="w-full mb-12 rounded-lg overflow-hidden shadow-lg animate-fade-in-up"
        style={{ animationDelay: "0s", animationFillMode: "both" }}
      >
        <video 
          ref={videoRef}
          muted 
          playsInline
          className="w-full h-auto"
        >
          <source src="/Header.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div 
        className="text-center mb-12 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/50" />
          <Heart className="w-5 h-5 text-dusty-rose fill-dusty-rose" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/50" />
        </div>
        <h3 className="font-script text-3xl text-foreground">
          Matthew & Morgan
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {details.map((detail, index) => (
          <div
            key={index}
            className={cn(
              "text-center p-6 rounded-lg",
              "bg-card/50 backdrop-blur-sm",
              "border border-border/50",
              "animate-fade-in-up",
              "hover:shadow-card transition-shadow duration-300"
            )}
            style={{ 
              animationDelay: detail.delay,
              animationFillMode: "both"
            }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
              <detail.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h4 className="font-serif text-sm tracking-widest uppercase text-muted-foreground mb-2">
              {detail.title}
            </h4>
            <p className="font-elegant text-xl text-foreground">
              {detail.content}
            </p>
            {detail.subContent && (
              <p className="font-elegant text-sm text-muted-foreground mt-1">
                {detail.subContent}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* RSVP Section */}
      <div 
        className="mt-16 text-center animate-fade-in-up"
        style={{ animationDelay: "0.8s", animationFillMode: "both" }}
      >
        <p className="font-elegant text-muted-foreground mb-6">
          We would be honored by your presence
        </p>
        <button
          className={cn(
            "px-8 py-3 rounded-full",
            "font-elegant text-sm tracking-widest uppercase",
            "bg-primary text-primary-foreground",
            "border border-gold/30",
            "shadow-lg hover:shadow-xl",
            "transition-all duration-300",
            "hover:scale-105 hover:bg-primary/90"
          )}
        >
          RVSP
        </button>
        <p className="mt-4 font-elegant text-xs text-muted-foreground tracking-wide">
          Please respond by May 1st, 2026
        </p>
      </div>

      {/* Footer message */}
      <div 
        className="mt-20 pb-12 text-center animate-fade-in-up"
        style={{ animationDelay: "1s", animationFillMode: "both" }}
      >
        <p className="font-script text-2xl text-dusty-rose">
          We can't wait to celebrate with you
        </p>
      </div>
    </div>
  );
};
