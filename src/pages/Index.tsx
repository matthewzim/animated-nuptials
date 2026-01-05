import { useState } from "react";
import { Envelope } from "@/components/Envelope";
import { FloatingPetals } from "@/components/FloatingPetals";
import { WeddingDetails } from "@/components/WeddingDetails";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [envelopeHidden, setEnvelopeHidden] = useState(false);

  const handleEnvelopeOpen = () => {
    setIsInvitationOpen(true);
    // Delay hiding the envelope to allow animation to complete
    setTimeout(() => {
      setEnvelopeHidden(true);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      {/* SEO */}
      <title>Maria & James Wedding | June 15, 2025</title>
      <meta name="description" content="You are cordially invited to celebrate the wedding of Maria and James on June 15, 2025 at The Grand Estate Gardens." />
      
      {/* Floating petals background */}
      <FloatingPetals />

      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(var(--dusty-rose) / 0.1) 0%, transparent 40%),
            radial-gradient(circle at 40% 80%, hsl(var(--gold-light) / 0.1) 0%, transparent 40%)
          `,
        }}
      />

      {/* Full-screen envelope overlay */}
      {!envelopeHidden && (
        <div 
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-1000",
            isInvitationOpen && "opacity-0 pointer-events-none"
          )}
        >
          <div className="w-full max-w-lg mx-auto px-4 animate-fade-in-up">
            <Envelope onOpen={handleEnvelopeOpen} />
          </div>
        </div>
      )}

      {/* Main content - revealed after envelope opens */}
      <div className={cn(
        "relative z-10 transition-opacity duration-700",
        isInvitationOpen ? "opacity-100" : "opacity-0"
      )}>
        {/* Hero section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center animate-fade-in-up">
            <p className="font-elegant text-sm tracking-[0.4em] uppercase text-muted-foreground mb-4">
              You are cordially invited
            </p>
            <h1 className="font-script text-5xl md:text-7xl text-foreground mb-4">
              Maria & James
            </h1>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold" />
              <span className="font-elegant text-sm tracking-widest text-muted-foreground">
                ARE GETTING MARRIED
              </span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold" />
            </div>
            
            <p className="font-serif text-lg text-foreground mb-2">
              Saturday, the Fifteenth of June
            </p>
            <p className="font-elegant text-4xl text-gold font-medium mb-8">
              2025
            </p>
          </div>

          {/* Scroll indicator */}
          <div 
            className="mt-12 animate-fade-in-up flex flex-col items-center"
            style={{ animationDelay: "0.5s" }}
          >
            <p className="font-elegant text-sm text-muted-foreground mb-2">
              Scroll for details
            </p>
            <div className="w-px h-8 bg-gradient-to-b from-gold to-transparent animate-pulse" />
          </div>
        </section>

        {/* Wedding details section */}
        <section className="py-12">
          <WeddingDetails isVisible={isInvitationOpen} />
        </section>
      </div>
    </main>
  );
};

export default Index;
