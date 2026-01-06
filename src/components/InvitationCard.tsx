import { cn } from "@/lib/utils";

export const InvitationCard = () => {
  return (
    <div 
      className={cn(
        "w-full h-full rounded-lg p-6 flex flex-col items-center justify-center text-center",
        "animate-card-reveal",
        "bg-cream shadow-card"
      )}
      style={{
        background: `
          linear-gradient(135deg, hsl(var(--cream)) 0%, hsl(40 35% 95%) 100%),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.01) 10px,
            rgba(0,0,0,0.01) 20px
          )
        `,
      }}
    >
      {/* Decorative top border */}
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)`,
        }}
      />

      {/* Pre-heading */}
      <p 
        className="font-elegant text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2"
        style={{ animationDelay: "0.2s" }}
      >
        Together with their families
      </p>

      {/* Names */}
      <h2 
        className="font-script text-4xl md:text-5xl text-foreground mb-1"
        style={{ 
          animationDelay: "0.3s",
          textShadow: "0 2px 4px rgba(0,0,0,0.05)" 
        }}
      >
        Maria & James
      </h2>

      {/* The Wedding Of text */}
      <p className="font-elegant text-xs tracking-[0.3em] uppercase text-gold my-2">
        The Wedding Of
      </p>

      {/* Invitation text */}
      <p 
        className="font-elegant text-sm tracking-wide text-muted-foreground mb-4"
        style={{ animationDelay: "0.4s" }}
      >
        Request the pleasure of your company<br />
        at the celebration of their marriage
      </p>

      {/* Date */}
      <div 
        className="mb-4"
        style={{ animationDelay: "0.5s" }}
      >
        <p className="font-serif text-lg tracking-wider text-foreground">
          Saturday, the Fifteenth of June
        </p>
        <p className="font-elegant text-3xl text-gold font-medium">
          2025
        </p>
        <p className="font-elegant text-sm text-muted-foreground mt-1">
          at four o'clock in the afternoon
        </p>
      </div>

      {/* Venue */}
      <div 
        className="text-center"
        style={{ animationDelay: "0.6s" }}
      >
        <p className="font-serif text-sm text-foreground">
          The Grand Estate Gardens
        </p>
        <p className="font-elegant text-xs text-muted-foreground tracking-wide">
          123 Blossom Lane, Tuscany Valley
        </p>
      </div>

      {/* Decorative bottom border */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)`,
        }}
      />

      {/* Corner decorations */}
      <svg 
        className="absolute top-3 left-3 w-6 h-6 text-gold/40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M3 3v6M3 3h6" />
      </svg>
      <svg 
        className="absolute top-3 right-3 w-6 h-6 text-gold/40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M21 3v6M21 3h-6" />
      </svg>
      <svg 
        className="absolute bottom-3 left-3 w-6 h-6 text-gold/40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M3 21v-6M3 21h6" />
      </svg>
      <svg 
        className="absolute bottom-3 right-3 w-6 h-6 text-gold/40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M21 21v-6M21 21h-6" />
      </svg>
    </div>
  );
};
