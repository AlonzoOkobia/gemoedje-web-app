"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ProviderRegistration } from "@/libs/types";
import { useState } from "react";

interface ProviderDetailsProps {
  provider: ProviderRegistration;
  onClose: () => void;
  onStatusChange: (providerId: string, status: "approved" | "rejected") => void;
}

export function ProviderDetails({
  provider,
  onClose,
  onStatusChange,
}: ProviderDetailsProps) {
  const [reviewNotes, setReviewNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );

  const handleAction = (type: "approve" | "reject") => {
    setActionType(type);
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (actionType) {
      onStatusChange(
        provider.id,
        actionType === "approve" ? "approved" : "rejected",
      );
    }
    setShowConfirmation(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Provider Registration Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{provider.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Provider Type</Label>
              <p className="font-medium">{provider.providerType}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{provider.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Phone</Label>
              <p className="font-medium">{provider.phone}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-muted-foreground">Practice Address</Label>
            <p className="font-medium">{provider.practiceAddress}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">KvK Number</Label>
              <p className="font-medium">{provider.kvkNumber}</p>
            </div>
            {provider.bigNumber && (
              <div>
                <Label className="text-muted-foreground">BIG Number</Label>
                <p className="font-medium">{provider.bigNumber}</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Review Notes</Label>
            <Textarea
              placeholder="Add notes about this registration..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => handleAction("reject")}>
            Reject
          </Button>
          <Button onClick={() => handleAction("approve")}>Approve</Button>
        </DialogFooter>
      </DialogContent>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm {actionType === "approve" ? "Approval" : "Rejection"}
            </DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to{" "}
            {actionType === "approve" ? "approve" : "reject"} this provider
            registration?
            {actionType === "approve"
              ? " They will be notified and can proceed with subscription selection."
              : " They will be notified of the rejection."}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={confirmAction}
            >
              Confirm {actionType === "approve" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
