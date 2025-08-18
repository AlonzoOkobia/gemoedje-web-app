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
import { Clock, Send, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  subject: string;
  recipients: string;
  status: "draft" | "sent" | "scheduled";
  date: string;
  content: string;
  openRate?: number;
  clickRate?: number;
  responses?: {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
  }[];
}

interface ViewMessageDialogProps {
  message: Message;
  onClose: () => void;
}

export function ViewMessageDialog({
  message,
  onClose,
}: ViewMessageDialogProps) {
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Message Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{message.subject}</h2>
              <Badge
                variant={
                  message.status === "sent"
                    ? "success"
                    : message.status === "scheduled"
                      ? "secondary"
                      : "outline"
                }
              >
                {message.status}
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Recipients: {message.recipients}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(message.date).toLocaleString()}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <p>{message.content}</p>
              </CardContent>
            </Card>

            {message.status === "sent" && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <Label>Open Rate</Label>
                    <p className="text-2xl font-bold">{message.openRate}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <Label>Click Rate</Label>
                    <p className="text-2xl font-bold">{message.clickRate}%</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {message.responses && message.responses.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Responses</h3>
                <div className="space-y-4">
                  {message.responses.map((response) => (
                    <Card key={response.id}>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">
                              {response.sender}
                            </span>
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {new Date(response.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{response.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {message.status === "sent" && (
            <div className="space-y-4">
              <Label>Reply</Label>
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your response..."
                rows={4}
              />
              <div className="flex justify-end">
                <Button onClick={handleSendReply}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </Button>
              </div>
            </div>
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
