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

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwsbxDiLqAR5Wy8IhLFhC4Ox9D_4V6VNfAym4SMF_pbc7HlmJNYFCre-4NVVaBERhY-wA/exec";

const RSVP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "",
    guests: "",
    meal: "",
    dietary: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
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
      const response = await fetch(GOOGLE_SCRIPT_URL, {
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

      // With no-cors, we can't read the response, but if no error was thrown, assume success
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

  // Show success state after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center animate-fade-in-up">
          <p className="font-elegant text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Thank You
          </p>
          <h1 className="font-script text-5xl md:text-6xl text-stone-600 mb-6">
            RSVP Received
          </h1>
          <p className="font-elegant text-muted-foreground mb-8">
            We're so excited to celebrate with you on August 8th, 2026!
          </p>
          <button
            onClick={() => navigate("/")}
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
            Back to Invitation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-elegant text-sm">Back to Invitation</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="font-elegant text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            We Would Be Honored
          </p>
          <h1 className="font-script text-5xl md:text-6xl text-stone-600 mb-4">
            RSVP
          </h1>
          <p className="font-elegant text-muted-foreground">
            Please respond by May 1st, 2026
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <Label htmlFor="name" className="font-elegant text-foreground">
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

          {/* Email */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            <Label htmlFor="email" className="font-elegant text-foreground">
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

          {/* Attending */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <Label htmlFor="attending" className="font-elegant text-foreground">
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

          {/* Number of Guests */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <Label htmlFor="guests" className="font-elegant text-foreground">
              Number of Guests
            </Label>
            <Select
              value={formData.guests}
              onValueChange={(value) => handleChange("guests", value)}
            >
              <SelectTrigger className="mt-2 bg-card/50 border-border/50">
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="3">3 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Meal Preference */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          >
            <Label htmlFor="meal" className="font-elegant text-foreground">
              Meal Preference
            </Label>
            <Select
              value={formData.meal}
              onValueChange={(value) => handleChange("meal", value)}
            >
              <SelectTrigger className="mt-2 bg-card/50 border-border/50">
                <SelectValue placeholder="Select meal preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beef">Beef</SelectItem>
                <SelectItem value="chicken">Chicken</SelectItem>
                <SelectItem value="fish">Fish</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dietary Restrictions */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.6s", animationFillMode: "both" }}
          >
            <Label htmlFor="dietary" className="font-elegant text-foreground">
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

          {/* Message */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.7s", animationFillMode: "both" }}
          >
            <Label htmlFor="message" className="font-elegant text-foreground">
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

          {/* Submit Button */}
          <div
            className="pt-6 animate-fade-in-up"
            style={{ animationDelay: "0.8s", animationFillMode: "both" }}
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full px-8 py-3 rounded-full",
                "font-elegant text-sm tracking-widest uppercase",
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
          </div>
        </form>

        {/* Footer */}
        <div
          className="mt-12 text-center animate-fade-in-up"
          style={{ animationDelay: "0.9s", animationFillMode: "both" }}
        >
          <p className="font-script text-2xl text-dusty-rose">
            We can't wait to celebrate with you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RSVP;
