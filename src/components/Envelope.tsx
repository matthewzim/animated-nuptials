import { useState } from "react";
import { cn } from "@/lib/utils";
import { WaxSeal } from "./WaxSeal";
import { InvitationCard } from "./InvitationCard";

interface EnvelopeProps {
  onOpen?: () => void;
}

export const Envelope = ({ onOpen }: EnvelopeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);

  const handleClick = () => {
    if (!isOpen) {
      setSealBroken(true);
      setTimeout(() => {
        setIsOpen(true);
        onOpen?.();
      }, 400);
    }
  };

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        className={cn(
          "relative cursor-pointer transition-all duration-700",
          !isOpen && "animate-float",
          isHovered && !isOpen && "scale-105"
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Envelope base */}
        <div
          className={cn(
            "relative w-full aspect-[4/3] rounded-lg shadow-envelope transform-style-3d transition-all duration-700",
            isOpen && "translate-y-8"
          )}
          style={{
            background: `linear-gradient(135deg, hsl(var(--envelope)) 0%, hsl(var(--envelope-flap)) 100%)`,
          }}
        >
          {/* Envelope inner (visible when open) */}
          <div
            className="absolute inset-2 rounded-md"
            style={{
              background: `hsl(var(--envelope-inner))`,
            }}
          />

          {/* Card container */}
          <div className={cn(
            "absolute inset-4 overflow-hidden",
            isOpen ? "opacity-100" : "opacity-0"
          )}>
            {isOpen && <InvitationCard />}
          </div>

          {/* Envelope back flap (triangle) */}
          <div
            className="absolute inset-x-0 top-0 overflow-hidden"
            style={{
              height: "50%",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: `linear-gradient(180deg, hsl(var(--envelope-flap)) 0%, hsl(var(--envelope)) 100%)`,
            }}
          />

          {/* Envelope front flap with 3D animation */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 origin-top transition-transform duration-700 ease-out",
              isOpen ? "[transform:rotateX(180deg)]" : "[transform:rotateX(0deg)]"
            )}
            style={{
              height: "50%",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front of flap */}
            <div
              className="absolute inset-0 backface-hidden rounded-t-lg"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: `linear-gradient(180deg, hsl(var(--envelope-flap)) 0%, hsl(var(--envelope)) 100%)`,
              }}
            >
              {/* Decorative edge line */}
              <div 
                className="absolute inset-x-4 top-4 h-px opacity-30"
                style={{
                  background: `linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)`,
                }}
              />
            </div>

            {/* Back of flap (inner paper color) */}
            <div
              className="absolute inset-0 backface-hidden [transform:rotateX(180deg)]"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: `hsl(var(--envelope-inner))`,
              }}
            />
          </div>

          {/* Side flaps (decorative) */}
          <div
            className="absolute bottom-0 left-0 w-1/2 h-1/2 origin-bottom-left"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 0 0)",
              background: `linear-gradient(45deg, hsl(var(--envelope-flap)) 0%, hsl(var(--envelope)) 100%)`,
              opacity: 0.7,
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-1/2 h-1/2 origin-bottom-right"
            style={{
              clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
              background: `linear-gradient(-45deg, hsl(var(--envelope-flap)) 0%, hsl(var(--envelope)) 100%)`,
              opacity: 0.7,
            }}
          />

          {/* Bottom flap */}
          <div
            className="absolute bottom-0 inset-x-0 h-1/3"
            style={{
              clipPath: "polygon(0 100%, 50% 20%, 100% 100%)",
              background: `linear-gradient(0deg, hsl(var(--envelope)) 0%, hsl(var(--envelope-flap)) 100%)`,
            }}
          />

          {/* Wax seal */}
          {!isOpen && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <WaxSeal isBreaking={sealBroken} />
            </div>
          )}

          {/* Shimmer effect on hover */}
          {!isOpen && isHovered && (
            <div className="absolute inset-0 animate-shimmer rounded-lg pointer-events-none" />
          )}
        </div>

        {/* Click instruction */}
        {!isOpen && (
          <p className="text-center mt-6 font-elegant text-muted-foreground text-sm tracking-widest uppercase animate-pulse">
            Click to open
          </p>
        )}
      </div>
    </div>
  );
};
