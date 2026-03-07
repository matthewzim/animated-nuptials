import { cn } from "@/lib/utils";
import { ScrollPhotoSlideshow } from "./ScrollPhotoSlideshow";
import { useNavigate, Link } from "react-router-dom";

interface WeddingDetailsProps {
  isVisible: boolean;
}

export const WeddingDetails = ({ isVisible }: WeddingDetailsProps) => {
  const navigate = useNavigate();

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
          {/* Traditional Invitation Header */}
          <div
            className="text-center mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <p className="font-script text-2xl md:text-3xl text-muted-foreground mb-8">
              Together with their families
            </p>

            <h2 className="font-serif text-4xl md:text-5xl tracking-[0.15em] uppercase text-foreground mb-3">
              Matthew
            </h2>
            <p className="font-script text-3xl md:text-4xl text-muted-foreground my-2">
              and
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-[0.15em] uppercase text-foreground mt-3">
              Morgan
            </h2>

            <p className="font-elegant text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mt-8">
              Joyfully Invite You To Their Wedding
            </p>
          </div>

          {/* Date & Venue Block — traditional layout with vertical divider */}
          <div
            className="animate-fade-in-up flex justify-center mb-8"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <div className="flex items-center gap-6 md:gap-8">
              {/* Date Column */}
              <div className="text-center">
                <p className="font-elegant text-sm md:text-base tracking-[0.25em] uppercase text-muted-foreground">
                  August
                </p>
                <p className="font-serif text-6xl md:text-7xl text-foreground leading-none my-1">
                  8
                </p>
                <p className="font-elegant text-sm md:text-base tracking-[0.25em] uppercase text-muted-foreground">
                  2026
                </p>
              </div>

              {/* Vertical Divider */}
              <div className="w-px h-28 bg-muted-foreground/40" />

              {/* Venue Column */}
              <div className="text-left">
                <p className="font-script text-2xl md:text-3xl text-foreground leading-tight">
                  UBC Botanical Garden
                </p>
                <p className="font-elegant text-xs md:text-sm tracking-[0.15em] uppercase text-muted-foreground mt-1">
                  6804 SW Marine Dr
                </p>
                <p className="font-elegant text-xs md:text-sm tracking-[0.15em] uppercase text-muted-foreground">
                  Vancouver, BC
                </p>
                <p className="font-script text-lg md:text-xl text-muted-foreground mt-2">
                  at 2 o'clock in the afternoon
                </p>
              </div>
            </div>
          </div>

          {/* Reception note */}
          <div
            className="text-center mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.6s", animationFillMode: "both" }}
          >
            <p className="font-script text-2xl md:text-3xl text-muted-foreground">
              Reception to follow
            </p>
          </div>

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
                { time: "2:00 PM", event: "Arrival" },
                { time: "2:30 PM", event: "Ceremony" },
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
                {
                  question: "Is there a wedding registry?",
                  answer: "We'll post our registry here in the coming months."
                }
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

          {/* Our Journey Section */}
          <div
            className="animate-fade-in-up p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-card transition-shadow duration-300"
            style={{ animationDelay: "1.1s", animationFillMode: "both" }}
          >
            <h4 className="font-serif text-sm tracking-widest uppercase text-muted-foreground mb-3">
              Our Journey
            </h4>
            <Link
              to="/journey"
              className={cn(
                "font-elegant text-base text-foreground",
                "underline underline-offset-4 decoration-border/60",
                "hover:decoration-primary hover:text-primary",
                "transition-colors duration-200"
              )}
            >
              Explore Here
            </Link>
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
