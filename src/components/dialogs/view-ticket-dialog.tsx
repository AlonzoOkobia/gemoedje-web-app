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
import { Textarea } from "@/components/ui/textarea";
import { Clock, MessageCircle, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isAdmin?: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  provider: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: string;
  lastUpdate: string;
  messages: Message[];
}

interface ViewTicketDialogProps {
  ticket: Ticket;
  onClose: () => void;
}

export function ViewTicketDialog({ ticket, onClose }: ViewTicketDialogProps) {
  const [reply, setReply] = useState("");

  const handleSendReply = () => {
    if (!reply.trim()) {
      toast.error("Empty Reply", {
        description: "Please enter a message before sending.",
      });
      return;
    }

    toast.success("Reply Sent", {
      description: "Your response has been sent successfully.",
    });
    setReply("");
  };

  const handleUpdateStatus = (newStatus: Ticket["status"]) => {
    toast.success("Status Updated", {
      description: `Ticket status has been updated to ${newStatus}.`,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Support Ticket Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{ticket.subject}</h2>
              <Badge
                variant={
                  ticket.status === "open"
                    ? "secondary"
                    : ticket.status === "in_progress"
                      ? "default"
                      : ticket.status === "resolved"
                        ? "success"
                        : "outline"
                }
              >
                {ticket.status}
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {ticket.provider}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Message History</h3>
            <div className="space-y-4">
              {ticket.messages.map((message) => (
                <Card
                  key={message.id}
                  className={message.isAdmin ? "bg-muted" : ""}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{message.sender}</span>
                        {message.isAdmin && (
                          <Badge variant="secondary">Admin</Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Reply</Label>
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your response..."
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus("resolved")}
              >
                Mark as Resolved
              </Button>
              <Button onClick={handleSendReply}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Reply
              </Button>
            </div>
          </div>
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
