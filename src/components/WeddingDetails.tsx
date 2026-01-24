import { Calendar, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollPhotoSlideshow } from "./ScrollPhotoSlideshow";

interface WeddingDetailsProps {
  isVisible: boolean;
}

export const WeddingDetails = ({ isVisible }: WeddingDetailsProps) => {
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
      title: "Ceremony & Reception",
      content: "UBC Botanical Garden",
      subContent: "6804 SW Marine Dr, Vancouver, BC V6T 2J9",
      delay: "0.6s",
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div 
        className="text-center mb-16 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <p className="font-elegant text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
          The Wedding Of
        </p>
        <h3 className="font-script text-5xl md:text-6xl text-stone-600">
          Matthew & Morgan
        </h3>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Photo Slideshow */}
        <div 
          className="animate-fade-in-up sticky top-8"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <ScrollPhotoSlideshow />
        </div>

        {/* Right: Wedding Details */}
        <div className="space-y-8">
          {details.map((detail, index) => (
            <div
              key={index}
              className={cn(
                "p-6 rounded-lg",
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
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 flex-shrink-0">
                  <detail.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
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
              </div>
            </div>
          ))}

          {/* RSVP Section */}
          <div 
            className="mt-12 text-center animate-fade-in-up p-8 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50"
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
              RSVP
            </button>
            <p className="mt-4 font-elegant text-sm text-muted-foreground tracking-wide">
              Please respond by May 1st, 2026.
            </p>
          </div>
        </div>
      </div>

      {/* Footer message */}
      <div 
        className="mt-20 pb-12 text-center animate-fade-in-up"
        style={{ animationDelay: "1s", animationFillMode: "both" }}
      >
        <p className="font-script text-2xl text-dusty-rose">
          We can't wait to celebrate with you.
        </p>
      </div>
    </div>
  );
};
