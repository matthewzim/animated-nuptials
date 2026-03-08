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
import { ArrowLeft, Loader2, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzH71yU4JUZDOFvL67baIMZGxQ4nB3wS-a07IDEYZx0qtPN6NgdcWSQztdOo9ofEBAjqg/exec";

const MAX_GUESTS = 6;
const TOTAL_STEPS = 6;

const RSVP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    names: [""],
    emails: [""],
    attendingList: [""],
    dietary: "",
    songRequest: "",
    message: "",
  });

  const submitRsvp = async () => {
    if (currentStep < TOTAL_STEPS - 1 || isSubmitting) {
      return;
    }

    const hasEmptyName = formData.names.some((n) => !n.trim());
    const hasEmptyEmail = formData.emails.some((e) => !e.trim());
    const hasEmptyAttending = formData.attendingList.some((a) => !a);

    if (hasEmptyName || hasEmptyEmail || hasEmptyAttending) {
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
          name: formData.names.join(", "),
          email: formData.emails.join(", "),
          attending: formData.attendingList.join(", "),
          dietary: formData.dietary,
          songRequest: formData.songRequest,
          message: formData.message,
          timestamp: new Date().toISOString(),
        }),
      });

      setIsSubmitted(true);
      toast({
        title: "RSVP Submitted!",
        description: "Thank you for your response.",
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

  const handleNameChange = (index: number, value: string) => {
    setFormData((prev) => {
      const names = [...prev.names];
      names[index] = value;
      return { ...prev, names };
    });
  };

  const handleEmailChange = (index: number, value: string) => {
    setFormData((prev) => {
      const emails = [...prev.emails];
      emails[index] = value;
      return { ...prev, emails };
    });
  };

  const handleAttendingChange = (index: number, value: string) => {
    setFormData((prev) => {
      const attendingList = [...prev.attendingList];
      attendingList[index] = value;
      return { ...prev, attendingList };
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addName = () => {
    if (formData.names.length < MAX_GUESTS) {
      setFormData((prev) => ({
        ...prev,
        names: [...prev.names, ""],
        attendingList: [...prev.attendingList, ""],
      }));
    }
  };

  const removeName = (index: number) => {
    if (formData.names.length > 1) {
      setFormData((prev) => ({
        ...prev,
        names: prev.names.filter((_, i) => i !== index),
        attendingList: prev.attendingList.filter((_, i) => i !== index),
      }));
    }
  };

  const addEmail = () => {
    if (formData.emails.length < MAX_GUESTS) {
      setFormData((prev) => ({
        ...prev,
        emails: [...prev.emails, ""],
      }));
    }
  };

  const removeEmail = (index: number) => {
    if (formData.emails.length > 1) {
      setFormData((prev) => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index),
      }));
    }
  };

  const goToNextStep = () => {
    if (currentStep === 0) {
      const hasEmptyName = formData.names.some((n) => !n.trim());
      if (hasEmptyName) {
        toast({
          title: "Full Name Required",
          description: "Please enter a full name for each guest.",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 1) {
      const hasEmptyEmail = formData.emails.some((e) => !e.trim());
      if (hasEmptyEmail) {
        toast({
          title: "Email Required",
          description: "Please enter an email for each entry.",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 2) {
      const hasEmptyAttending = formData.attendingList.some((a) => !a);
      if (hasEmptyAttending) {
        toast({
          title: "RSVP Response Required",
          description: "Please select a response for each guest.",
          variant: "destructive",
        });
        return;
      }
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
            <Label className="text-foreground font-medium">
              Full Name{formData.names.length > 1 ? "s" : ""} *
            </Label>
            <div className="space-y-3 mt-2">
              {formData.names.map((name, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    required
                    placeholder={index === 0 ? "Enter your full name" : `Guest ${index + 1} full name`}
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="bg-card/50 border-border/50 focus:border-primary"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeName(index)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {formData.names.length < MAX_GUESTS && (
              <button
                type="button"
                onClick={addName}
                className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="w-7 h-7 flex items-center justify-center rounded-full border border-border/50 hover:border-foreground/30 transition-colors">
                  <Plus className="w-4 h-4" />
                </span>
                Add another guest
              </button>
            )}
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in-up">
            <Label className="text-foreground font-medium">
              Email Address{formData.emails.length > 1 ? "es" : ""} *
            </Label>
            <div className="space-y-3 mt-2">
              {formData.emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="email"
                    required
                    placeholder={index === 0 ? "Enter your email" : `Email address ${index + 1}`}
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="bg-card/50 border-border/50 focus:border-primary"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeEmail(index)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {formData.emails.length < MAX_GUESTS && (
              <button
                type="button"
                onClick={addEmail}
                className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="w-7 h-7 flex items-center justify-center rounded-full border border-border/50 hover:border-foreground/30 transition-colors">
                  <Plus className="w-4 h-4" />
                </span>
                Add another email
              </button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in-up">
            <Label className="text-foreground font-medium">
              Will you be attending? *
            </Label>
            <div className="space-y-4 mt-2">
              {formData.names.map((name, index) => (
                <div key={index}>
                  <p className="text-sm text-muted-foreground mb-1">
                    {name.trim() || `Guest ${index + 1}`}
                  </p>
                  <Select
                    value={formData.attendingList[index] || ""}
                    onValueChange={(value) => handleAttendingChange(index, value)}
                  >
                    <SelectTrigger className="bg-card/50 border-border/50">
                      <SelectValue placeholder="Select your response" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Joyfully Accept</SelectItem>
                      <SelectItem value="no">Respectfully Decline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
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
          <p className="text-muted-foreground mt-2">We kindly ask that you bring only the guest(s) specified on your invitation.</p>
        </div>

        <form className="space-y-6">
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
                type="button"
                onClick={submitRsvp}
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
