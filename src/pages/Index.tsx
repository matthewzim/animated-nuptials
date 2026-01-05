import { useState } from "react";
import { Envelope } from "@/components/Envelope";
import { FloatingPetals } from "@/components/FloatingPetals";
import { WeddingDetails } from "@/components/WeddingDetails";

const Index = () => {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);

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

      <div className="relative z-10">
        {/* Hero section with envelope */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
          {/* The interactive envelope - centered and prominent */}
          <div className="w-full max-w-lg mx-auto animate-fade-in-up">
            <Envelope onOpen={() => setIsInvitationOpen(true)} />
          </div>

          {/* Scroll indicator when invitation is open */}
          {isInvitationOpen && (
            <div 
              className="mt-12 animate-fade-in-up flex flex-col items-center"
              style={{ animationDelay: "1.2s" }}
            >
              <p className="font-elegant text-sm text-muted-foreground mb-2">
                Scroll for details
              </p>
              <div className="w-px h-8 bg-gradient-to-b from-gold to-transparent animate-pulse" />
            </div>
          )}
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
