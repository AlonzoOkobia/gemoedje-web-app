"use client";
import { ViewMessageDialog } from "@/components/dialogs/view-message-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Users } from "lucide-react";
import { useState } from "react";

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

const mockMessages: Message[] = [
  {
    id: "1",
    subject: "Welcome to Our Platform",
    recipients: "New Providers",
    status: "sent",
    date: "2024-03-15",
    content:
      "Welcome to our platform! We are excited to have you join our community...",
    openRate: 75,
    clickRate: 45,
    responses: [
      {
        id: "1",
        sender: "Dr. Sarah Johnson",
        content: "Thank you for the warm welcome!",
        timestamp: "2024-03-15T12:00:00Z",
      },
    ],
  },
];

export function CommunicationTools() {
  const [messages] = useState<Message[]>(mockMessages);
  const [selectedRecipients, setSelectedRecipients] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <Mail className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-muted-foreground text-xs">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Open Rate
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-muted-foreground text-xs">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Select
                value={selectedRecipients}
                onValueChange={setSelectedRecipients}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="premium">Premium Providers</SelectItem>
                  <SelectItem value="basic">Basic Providers</SelectItem>
                  <SelectItem value="inactive">Inactive Providers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Subject" />
            <Textarea
              placeholder="Message content..."
              className="min-h-[200px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save Draft</Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>{message.recipients}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          message.status === "sent"
                            ? "success"
                            : message.status === "scheduled"
                              ? "secondary"
                              : "outline"
                        }
                        className="capitalize"
                      >
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(message.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {message.openRate ? `${message.openRate}%` : "-"}
                    </TableCell>
                    <TableCell>
                      {message.clickRate ? `${message.clickRate}%` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMessage(message)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedMessage && (
        <ViewMessageDialog
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
}
