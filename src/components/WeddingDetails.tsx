import { cn } from "@/lib/utils";
import { ScrollPhotoSlideshow } from "./ScrollPhotoSlideshow";
import { useNavigate, Link } from "react-router-dom";

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
      content: "2:00 PM Arrival // 2:30 PM Ceremony",
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
          className="lg:w-1/2 h-[50vh] lg:h-full overflow-y-auto"
          data-details-content
        >
          <div className="relative space-y-8 px-8 lg:px-12 py-16 m-6">
          {/* Traditional Invitation Header */}
          <div
            className="text-center mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
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
              className="text-center animate-fade-in-up"
              style={{
                animationDelay: detail.delay,
                animationFillMode: "both"
              }}
            >
              <p className="font-serif text-base md:text-lg tracking-wide text-foreground">
                {detail.content}
              </p>
              {detail.subContent && (
                <p className="font-elegant text-sm text-muted-foreground mt-1">
                  {detail.subContent}
                </p>
              )}
            </div>
          ))}

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 my-4 animate-fade-in-up" style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
            <div className="h-px w-16 bg-muted-foreground/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            <div className="h-px w-16 bg-muted-foreground/30" />
          </div>

          {/* Timeline Section */}
          <div
            className="text-center animate-fade-in-up"
            style={{ animationDelay: "0.8s", animationFillMode: "both" }}
          >
            <h4 className="font-elegant text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-8">
              Order of the Day
            </h4>
            <div className="space-y-5">
              {[
                { time: "2:00 PM", event: "Arrival" },
                { time: "2:30 PM", event: "Ceremony" },
                { time: "4:00 PM", event: "Cocktail Hour" },
                { time: "5:30 PM", event: "Reception" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center gap-4">
                  <span className="font-elegant text-sm tracking-[0.15em] uppercase text-muted-foreground min-w-[80px] text-right">
                    {item.time}
                  </span>
                  <div className="h-px w-6 bg-muted-foreground/30" />
                  <span className="font-script text-xl md:text-2xl text-foreground min-w-[140px] text-left">
                    {item.event}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 my-4 animate-fade-in-up" style={{ animationDelay: "0.9s", animationFillMode: "both" }}>
            <div className="h-px w-16 bg-muted-foreground/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            <div className="h-px w-16 bg-muted-foreground/30" />
          </div>

          {/* FAQ Section */}
          <div
            className="text-center animate-fade-in-up"
            style={{ animationDelay: "1s", animationFillMode: "both" }}
          >
            <h4 className="font-elegant text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-10">
              Guest Information
            </h4>
            <div className="space-y-8">
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
                <div key={index} className="text-center">
                  <h5 className="font-serif text-base md:text-lg tracking-wide text-foreground mb-2">
                    {faq.question}
                  </h5>
                  <p className="font-elegant text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 my-4 animate-fade-in-up" style={{ animationDelay: "1.05s", animationFillMode: "both" }}>
            <div className="h-px w-16 bg-muted-foreground/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            <div className="h-px w-16 bg-muted-foreground/30" />
          </div>

          {/* Our Journey Section */}
          <div
            className="text-center animate-fade-in-up"
            style={{ animationDelay: "1.1s", animationFillMode: "both" }}
          >
            <h4 className="font-elegant text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Our Journey
            </h4>
            <Link
              to="/journey"
              className={cn(
                "font-script text-2xl md:text-3xl text-foreground",
                "hover:text-primary",
                "transition-colors duration-200"
              )}
            >
              Explore our story
            </Link>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 my-4 animate-fade-in-up" style={{ animationDelay: "1.15s", animationFillMode: "both" }}>
            <div className="h-px w-16 bg-muted-foreground/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            <div className="h-px w-16 bg-muted-foreground/30" />
          </div>

          {/* RSVP Section */}
          <div
            className="text-center animate-fade-in-up py-4"
            style={{ animationDelay: "1.2s", animationFillMode: "both" }}
          >
            <p className="font-script text-2xl md:text-3xl text-muted-foreground mb-6">
              We would be honoured by your presence
            </p>
            <button
              onClick={() => navigate("/rsvp")}
              className={cn(
                "px-10 py-3",
                "font-elegant text-sm md:text-base tracking-[0.3em] uppercase",
                "text-foreground",
                "border border-muted-foreground/40",
                "hover:bg-foreground hover:text-background",
                "transition-all duration-300"
              )}
            >
              Kindly Respond
            </button>
            <p className="mt-6 font-elegant text-sm tracking-[0.15em] uppercase text-muted-foreground">
              Please respond by May 1st, 2026
            </p>
          </div>

          </div>

          {/* Flower background image - flush to bottom, left, and right */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "1.3s", animationFillMode: "both" }}
          >
            <img
              src="/flowerback.png"
              alt="Floral decoration"
              className="w-full block"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
