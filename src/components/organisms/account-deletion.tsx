import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Download, HelpCircle, Timer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AccountDeletionProps {
  open: boolean;
  onClose: () => void;
}

type DeletionStep = "feedback" | "confirmation" | "final-warning";

const deletionReasons = [
  "No longer need the service",
  "Found a different platform",
  "Privacy concerns",
  "Technical issues",
  "Cost concerns",
  "Other",
];

export function AccountDeletion({ open, onClose }: AccountDeletionProps) {
  const [step, setStep] = useState<DeletionStep>("feedback");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const handleSubmitFeedback = () => {
    if (!reason) {
      toast("Required Field", {
        description: "Please select a reason for deleting your account",
      });
      return;
    }
    setStep("confirmation");
  };

  const handleConfirmation = () => {
    if (confirmText !== "DELETE") {
      toast.error("Invalid Confirmation", {
        description: "Please type DELETE to confirm account deletion",
      });
      return;
    }
    setStep("final-warning");
  };

  const handleAccountDeletion = () => {
    toast("Account Deletion Initiated", {
      description:
        "Your account will be permanently deleted in 30 days. We've sent you an email with more information.",
    });
    onClose();
  };

  const handleClose = () => {
    setStep("feedback");
    setReason("");
    setFeedback("");
    setConfirmText("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === "feedback" && (
          <>
            <DialogHeader>
              <DialogTitle>We&apos;re Sorry to See You Go</DialogTitle>
              <DialogDescription>
                Before you delete your account, please help us understand why
                you&apos;re leaving
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <Label>Why are you deleting your account?</Label>
                <RadioGroup value={reason} onValueChange={setReason}>
                  {deletionReasons.map((r) => (
                    <div key={r} className="flex items-center space-x-2">
                      <RadioGroupItem value={r} id={r} />
                      <Label htmlFor={r}>{r}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Additional Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmitFeedback}>Continue</Button>
            </DialogFooter>
          </>
        )}

        {step === "confirmation" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Confirm Account Deletion
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. Please read the following
                information carefully.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <HelpCircle className="h-4 w-4" />
                <AlertDescription>
                  Your account will be scheduled for deletion with a 30-day
                  recovery period. During this time, you can log in to cancel
                  the deletion.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Timer className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    Deletion will be completed on{" "}
                    {new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast("Data Export Started", {
                      description:
                        "Your data export will be emailed to you shortly.",
                    });
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Your Data
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Type DELETE to confirm</Label>
                <Input
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmation}>
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "final-warning" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Final Warning
              </DialogTitle>
              <DialogDescription>
                Are you absolutely sure you want to delete your account?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will:
                  <ul className="mt-2 list-inside list-disc">
                    <li>Delete all your profile information</li>
                    <li>Remove your provider listing</li>
                    <li>Cancel any active subscriptions</li>
                    <li>Delete all messages and communications</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Keep My Account
              </Button>
              <Button variant="destructive" onClick={handleAccountDeletion}>
                Yes, Delete My Account
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
