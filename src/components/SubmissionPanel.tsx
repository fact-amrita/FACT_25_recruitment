import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

interface SubmissionPanelProps {
  isEnabled: boolean;
}

interface FormData {
  conclusion: string;
  reasoning: string;
  name: string;
  email: string;
  rollNumber: string;
  phone: string;
  consent: boolean;
}

const SUBMIT_URL =
  "https://script.google.com/macros/s/AKfycbz9aWSkQyK77URHkmJ4fQfypTZMIgGK25E7glUZkYa_DCkPYOxf0yY2o1oYo1L5dnq_/exec";

export function SubmissionPanel({ isEnabled }: SubmissionPanelProps) {
  const [formData, setFormData] = useState<FormData>({
    conclusion: "",
    reasoning: "",
    name: "",
    email: "",
    rollNumber: "",
    phone: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const conclusions = [
    { value: "Krishn", label: "Krishn" },
    { value: "Anita", label: "Anita" },
    { value: "Insider + External Collusion", label: "Insider + External Collusion" },
    { value: "Insufficient Evidence", label: "Insufficient Evidence" },
  ];

  const isFormValid = () => {
    return (
      formData.conclusion &&
      formData.reasoning.trim().length > 10 &&
      formData.name.trim() &&
      formData.email.includes("@") &&
      formData.rollNumber.trim() &&
      formData.phone.trim().length >= 10 &&
      formData.consent
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Create a temporary hidden form to submit to Apps Script
    const form = document.createElement("form");
    form.action = SUBMIT_URL;
    form.method = "POST";
    form.target = "hidden_iframe";

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    // Add timestamp
    const ts = document.createElement("input");
    ts.type = "hidden";
    ts.name = "timestamp";
    ts.value = new Date().toISOString();
    form.appendChild(ts);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Success",
      description: "Report submitted to Google Sheets. Thank you!",
    });
  };

  if (!isEnabled) {
    return (
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Card className="border-muted">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Review all evidence to unlock the submission panel
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 cyber-grid">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold bg-gradient-to-r from-primary to-forensic-red bg-clip-text text-transparent">
            Submit Findings
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-primary to-forensic-red mx-auto"></div>
        </div>

        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm animate-slide-up">
          <CardHeader>
            <CardTitle className="font-orbitron text-xl text-center">
              Case Analysis Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSubmitted ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-green-400 mb-4">Thank you for your submission!</h3>
                <p className="text-lg text-muted-foreground">
                  Your report has been received. Good luck, Investigator.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Conclusion */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Primary Conclusion
                  </Label>
                  <RadioGroup
                    value={formData.conclusion}
                    onValueChange={(value) =>
                      setFormData({ ...formData, conclusion: value })
                    }
                    className="space-y-2"
                  >
                    {conclusions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label
                          htmlFor={option.value}
                          className="font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Reasoning */}
                <div className="space-y-3">
                  <Label htmlFor="reasoning" className="text-base font-semibold">
                    Reasoning (4–6 bullet points) *
                  </Label>
                  <Textarea
                    id="reasoning"
                    placeholder="• Point 1: Evidence from login logs shows...&#10;• Point 2: The email draft indicates...&#10;• Point 3: File metadata reveals..."
                    value={formData.reasoning}
                    onChange={(e) =>
                      setFormData({ ...formData, reasoning: e.target.value })
                    }
                    className="min-h-[120px] font-mono text-sm"
                    required
                  />
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number *</Label>
                    <Input
                      id="rollNumber"
                      value={formData.rollNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, rollNumber: e.target.value })
                      }
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                {/* Consent */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, consent: !!checked })
                    }
                    required
                  />
                  <Label htmlFor="consent" className="text-sm cursor-pointer">
                    I confirm this is my own analysis.
                  </Label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className="w-full font-orbitron font-semibold text-lg py-6 glow-primary hover:glow-primary"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Report
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hidden iframe for form submission */}
      <iframe name="hidden_iframe" style={{ display: "none" }} />
    </section>
  );
}
