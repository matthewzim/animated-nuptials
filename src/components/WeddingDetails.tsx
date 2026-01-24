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
    <div className="w-full relative">
      {/* Two Column Layout - Full Width */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left: Sticky Photo Slideshow - stays in place while scrolling through details */}
        <div 
          className="animate-fade-in-up lg:sticky lg:top-0 h-screen hidden lg:block"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <ScrollPhotoSlideshow />
        </div>

        {/* Right: Wedding Details */}
        <div className="space-y-8 px-8 lg:px-12 py-16">
          {/* Header - Now on right side */}
          <div 
            className="text-center lg:text-left mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <p className="font-elegant text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              The Wedding Of
            </p>
            <h3 className="font-script text-5xl md:text-6xl text-stone-600">
              Matthew & Morgan
            </h3>
          </div>
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

          {/* Timeline Section */}
          <div 
            className="animate-fade-in-up p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
            style={{ animationDelay: "0.8s", animationFillMode: "both" }}
          >
            <h4 className="font-serif text-sm tracking-widest uppercase text-muted-foreground mb-6">
              Timeline
            </h4>
            <div className="space-y-4">
              {[
                { time: "2:30 PM", event: "Arrival" },
                { time: "3:00 PM", event: "Ceremony" },
                { time: "4:00 PM", event: "Cocktail Hour" },
                { time: "5:30 PM", event: "Reception" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="font-elegant text-lg text-primary min-w-[80px]">{item.time}</span>
                  <span className="font-elegant text-lg text-foreground">{item.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div 
            className="animate-fade-in-up"
            style={{ animationDelay: "1s", animationFillMode: "both" }}
          >
            <h4 className="font-serif text-sm tracking-widest uppercase text-muted-foreground mb-6">
              FAQ
            </h4>
            <div className="space-y-6">
              {[
                {
                  question: "Dress Code",
                  answer: "We invite you to wear cocktail attire and embrace bright, cheerful summer colours."
                },
                {
                  question: "Parking",
                  answer: "Please note that parking at the venue is very limited and will be reserved for setup assistance. Consider parking at Thunderbird Stadium or throughout UBC campus. We encourage guests to carpool or Uber where possible."
                },
                {
                  question: "Am I allowed to bring a plus one?",
                  answer: "We kindly ask that you bring only the guest(s) specified on your invitation."
                },
                {
                  question: "What time should I arrive at your wedding ceremony?",
                  answer: "We recommend arriving by 2:30PM to give yourself plenty of time to settle in before the ceremony starts at 3PM. We can't wait to see you there!"
                },
                {
                  question: "Will your wedding be indoors or outdoors?",
                  answer: "Our wedding ceremony will be held outdoors, rain or shine. Please come prepared for the weather. If it should rain, umbrellas will be provided to guests. Our reception will be a combination of both indoor and outdoor areas."
                },
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className="p-5 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50"
                >
                  <h5 className="font-serif text-base text-foreground mb-2">
                    {faq.question}
                  </h5>
                  <p className="font-elegant text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Section */}
          <div 
            className="mt-12 text-center animate-fade-in-up p-8 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50"
            style={{ animationDelay: "1.2s", animationFillMode: "both" }}
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

          {/* Footer message */}
          <div 
            className="mt-12 text-center lg:text-left animate-fade-in-up"
            style={{ animationDelay: "1s", animationFillMode: "both" }}
          >
            <p className="font-script text-2xl text-dusty-rose">
              We can't wait to celebrate with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
