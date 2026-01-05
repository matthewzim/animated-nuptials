import { cn } from "@/lib/utils";

interface WaxSealProps {
  initials?: string;
  className?: string;
  isBreaking?: boolean;
}

export const WaxSeal = ({ initials = "M&J", className, isBreaking }: WaxSealProps) => {
  return (
    <div
      className={cn(
        "relative w-16 h-16 rounded-full shadow-seal transition-all duration-500",
        isBreaking && "animate-seal-break",
        className
      )}
      style={{
        background: `radial-gradient(circle at 30% 30%, hsl(var(--wax-seal-shine)), hsl(var(--wax-seal)) 60%)`,
      }}
    >
      {/* Wax texture overlay */}
      <div 
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(0,0,0,0.2) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Inner ring */}
      <div className="absolute inset-2 rounded-full border-2 border-wax-shine/40" />
      
      {/* Initials */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-script text-lg text-cream/90 drop-shadow-sm">
          {initials}
        </span>
      </div>
      
      {/* Drip effects */}
      <div 
        className="absolute -bottom-1 left-1/4 w-3 h-4 rounded-b-full"
        style={{
          background: `linear-gradient(to bottom, hsl(var(--wax-seal)), hsl(var(--wax-seal)) 80%)`,
        }}
      />
      <div 
        className="absolute -bottom-0.5 right-1/3 w-2 h-2 rounded-b-full"
        style={{
          background: `hsl(var(--wax-seal))`,
        }}
      />
    </div>
  );
};
