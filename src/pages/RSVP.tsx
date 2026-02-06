import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwsbxDiLqAR5Wy8IhLFhC4Ox9D_4V6VNfAym4SMF_pbc7HlmJNYFCre-4NVVaBERhY-wA/exec";

const TOTAL_STEPS = 6;

const RSVP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "",
    dietary: "",
    songRequest: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < TOTAL_STEPS - 1) {
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.attending) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      setIsSubmitted(true);
      toast({
        title: "RSVP Submitted!",
        description: "Thank you for your response. We can't wait to celebrate with you!",
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goToNextStep = () => {
    if (currentStep === 0 && !formData.name.trim()) {
      toast({
        title: "Full Name Required",
        description: "Please enter your full name before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 1 && !formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2 && !formData.attending) {
      toast({
        title: "RSVP Response Required",
        description: "Please select whether you can attend.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderCurrentQuestion = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="animate-fade-in-up">
            <Label htmlFor="name" className="text-foreground font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              required
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-2 bg-card/50 border-border/50 focus:border-primary"
            />
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in-up">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-2 bg-card/50 border-border/50 focus:border-primary"
            />
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in-up">
            <Label htmlFor="attending" className="text-foreground font-medium">
              Will you be attending? *
            </Label>
            <Select
              value={formData.attending}
              onValueChange={(value) => handleChange("attending", value)}
            >
              <SelectTrigger className="mt-2 bg-card/50 border-border/50">
                <SelectValue placeholder="Select your response" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Joyfully Accept</SelectItem>
                <SelectItem value="no">Regretfully Decline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in-up">
            <Label htmlFor="dietary" className="text-foreground font-medium">
              Dietary Restrictions or Allergies
            </Label>
            <Input
              id="dietary"
              type="text"
              placeholder="e.g., gluten-free, nut allergy"
              value={formData.dietary}
              onChange={(e) => handleChange("dietary", e.target.value)}
              className="mt-2 bg-card/50 border-border/50 focus:border-primary"
            />
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in-up">
            <Label htmlFor="songRequest" className="text-foreground font-medium">
              Song Request
            </Label>
            <Input
              id="songRequest"
              type="text"
              placeholder="Share a song that will get you on the dance floor"
              value={formData.songRequest}
              onChange={(e) => handleChange("songRequest", e.target.value)}
              className="mt-2 bg-card/50 border-border/50 focus:border-primary"
            />
          </div>
        );
      default:
        return (
          <div className="animate-fade-in-up">
            <Label htmlFor="message" className="text-foreground font-medium">
              Message for the Couple
            </Label>
            <Textarea
              id="message"
              placeholder="Share your well wishes..."
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="mt-2 bg-card/50 border-border/50 focus:border-primary min-h-[120px]"
            />
          </div>
        );
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center animate-fade-in-up">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-semibold">
            Thank You
          </p>
          <h1 className="text-5xl md:text-6xl text-stone-600 mb-6 font-semibold">
            RSVP Received
          </h1>
          <p className="text-muted-foreground mb-8">
            We're so excited to celebrate with you on August 8th, 2026!
          </p>
          <button
            onClick={() => navigate("/")}
            className={cn(
              "px-8 py-3 rounded-full",
              "text-sm tracking-widest uppercase font-semibold",
              "bg-primary text-primary-foreground",
              "border border-gold/30",
              "shadow-lg hover:shadow-xl",
              "transition-all duration-300",
              "hover:scale-105 hover:bg-primary/90"
            )}
          >
            Back to Invitation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Invitation</span>
        </button>

        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-semibold">
            We Would Be Honored
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-stone-600 mb-4 font-semibold">RSVP</h1>
          <p className="text-muted-foreground">Please respond by May 1st, 2026</p>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && currentStep < TOTAL_STEPS - 1) {
              e.preventDefault();
            }
          }}
          className="space-y-6"
        >
          {renderCurrentQuestion()}

          <div className="pt-4 flex items-center gap-3">
            {currentStep > 0 && (
              <Button
                type="button"
                onClick={goToPreviousStep}
                variant="outline"
                className="w-1/3"
              >
                Back
              </Button>
            )}

            {currentStep < TOTAL_STEPS - 1 ? (
              <Button type="button" onClick={goToNextStep} className="flex-1">
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "flex-1 px-8 py-3 rounded-full",
                  "text-sm tracking-widest uppercase font-semibold",
                  "bg-primary text-primary-foreground",
                  "border border-gold/30",
                  "shadow-lg hover:shadow-xl",
                  "transition-all duration-300",
                  "hover:scale-[1.02] hover:bg-primary/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit RSVP"
                )}
              </Button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};

export default RSVP;
