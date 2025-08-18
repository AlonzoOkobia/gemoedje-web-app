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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard, FileText, Receipt } from "lucide-react";

interface Transaction {
  id: string;
  provider: string;
  amount: number;
  type: "subscription" | "refund" | "charge";
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
  paymentMethod?: {
    type: string;
    last4: string;
    expiryDate: string;
  };
  invoice?: {
    number: string;
    url: string;
  };
}

interface ViewTransactionDialogProps {
  transaction: Transaction;
  onClose: () => void;
}

export function ViewTransactionDialog({
  transaction,
  onClose,
}: ViewTransactionDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {transaction.type === "refund" ? "Refund" : "Payment"} Details
              </h2>
              <Badge
                variant={
                  transaction.status === "completed"
                    ? "success"
                    : transaction.status === "pending"
                      ? "secondary"
                      : "destructive"
                }
              >
                {transaction.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {transaction.description}
            </p>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Label>Amount</Label>
                  <span
                    className={`text-xl font-bold ${
                      transaction.amount < 0 ? "text-destructive" : ""
                    }`}
                  >
                    €{Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Label>Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Provider Information</h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <p>{transaction.provider}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {transaction.paymentMethod && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Payment Method</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="text-muted-foreground h-6 w-6" />
                      <div>
                        <p className="font-medium">
                          {transaction.paymentMethod.type} ending in{" "}
                          {transaction.paymentMethod.last4}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Expires {transaction.paymentMethod.expiryDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {transaction.invoice && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Invoice</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        <span>Invoice #{transaction.invoice.number}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
