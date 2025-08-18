"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  providerId: string;
  providerName: string;
  email: string;
  plan: "basic" | "premium";
  status: "active" | "cancelled" | "past_due";
  startDate: string;
  endDate?: string;
  amount: number;
  billingCycle: "monthly" | "annual";
  lastPayment: string;
  nextPayment: string;
}

interface ManageSubscriptionDialogProps {
  subscription: Subscription;
  onClose: () => void;
}

export function ManageSubscriptionDialog({
  subscription,
  onClose,
}: ManageSubscriptionDialogProps) {
  const handleSave = () => {
    toast.success("Subscription Updated", {
      description: "The subscription changes have been saved successfully.",
    });
    onClose();
  };

  const handleCancel = () => {
    toast.warning("Subscription Cancelled", {
      description: "The subscription has been cancelled successfully.",
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Subscription</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Provider Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Name</Label>
                <p className="text-sm">{subscription.providerName}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm">{subscription.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Subscription Details</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Plan Type</Label>
                <Select defaultValue={subscription.plan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Plan</SelectItem>
                    <SelectItem value="premium">Premium Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Billing Cycle</Label>
                <Select defaultValue={subscription.billingCycle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount (€)</Label>
                <Input
                  type="number"
                  defaultValue={subscription.amount}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Badge
                  variant={
                    subscription.status === "active"
                      ? "success"
                      : subscription.status === "cancelled"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {subscription.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Payment Information</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <CreditCard className="text-muted-foreground h-6 w-6" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-muted-foreground text-sm">
                      Expires 12/24
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Last Payment</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>
                    {new Date(subscription.lastPayment).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <Label>Next Payment</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>
                    {new Date(subscription.nextPayment).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="destructive" onClick={handleCancel}>
            Cancel Subscription
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
