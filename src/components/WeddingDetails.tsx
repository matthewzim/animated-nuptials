import { cn } from "@/lib/utils";
import { ScrollPhotoSlideshow } from "./ScrollPhotoSlideshow";
import { useNavigate } from "react-router-dom";

interface WeddingDetailsProps {
  isVisible: boolean;
}

export const WeddingDetails = ({ isVisible }: WeddingDetailsProps) => {
  const navigate = useNavigate();
  const details = [
    {
      content: "August 8th, 2026",
      delay: "0.2s",
    },
    {
      content: "2:30 PM Arrival // 3:00 Ceremony",
      delay: "0.4s",
    },
    {
      content: "UBC Botanical Garden",
      subContent: "6804 SW Marine Dr, Vancouver, BC V6T 2J9",
      delay: "0.6s",
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="w-full h-screen overflow-hidden" data-wedding-details>
      {/* Two Column Layout - Fixed height, no page scroll */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left: Fixed Photo Slideshow */}
        <div 
          className="animate-fade-in-up lg:w-1/2 h-[50vh] lg:h-full flex-shrink-0"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <ScrollPhotoSlideshow />
        </div>

        {/* Right: Scrollable Wedding Details - only this column scrolls */}
        <div 
          className="lg:w-1/2 h-[50vh] lg:h-full overflow-y-auto space-y-8 px-8 lg:px-12 py-16" 
          data-details-content
        >
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
              <div>
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
              onClick={() => navigate("/rsvp")}
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
