"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockMessages } from "@/mock-data/messages";
import type { Message } from "@/types/message";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Paperclip, Star } from "lucide-react";
import { useState } from "react";

export function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const markMessageAsRead = (id: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, status: "read" as const } : msg,
      ),
    );
  };

  const toggleImportant = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, isImportant: !msg.isImportant } : msg,
      ),
    );
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      markMessageAsRead(message.id);
    }
  };

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Messages</CardTitle>
          <Button variant="outline" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid h-[calc(100%-5rem)] grid-cols-1 gap-4 p-0 md:grid-cols-2">
        <ScrollArea className="h-full border-r">
          <div className="space-y-1 p-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`cursor-pointer rounded-lg p-4 transition-colors ${
                  selectedMessage?.id === message.id
                    ? "bg-primary/10"
                    : "hover:bg-muted/50"
                } ${message.status === "unread" ? "bg-primary/5" : ""}`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                      {message.sender.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">
                          {message.sender.name}
                        </h3>
                        <span className="text-muted-foreground text-xs">
                          {message.sender.role}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(message.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleImportant(message.id, e)}
                    className="text-muted-foreground hover:text-amber-500"
                  >
                    {message.isImportant ? (
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-muted-foreground line-clamp-1 text-sm">
                  {message.content}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  {message.attachments.length > 0 && (
                    <div className="text-muted-foreground flex items-center text-xs">
                      <Paperclip className="mr-1 h-3 w-3" />
                      {message.attachments.length} attachment
                    </div>
                  )}
                  {message.status === "unread" && (
                    <div className="text-primary flex items-center text-xs">
                      <div className="bg-primary mr-1 h-2 w-2 rounded-full" />
                      Unread
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="h-full">
          {selectedMessage ? (
            <div className="flex h-full flex-col">
              <div className="border-b p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">
                      {selectedMessage.sender.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {selectedMessage.sender.name}
                        </h3>
                        <span className="text-muted-foreground text-xs">
                          {selectedMessage.sender.email}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {formatDistanceToNow(
                          new Date(selectedMessage.timestamp),
                          { addSuffix: true },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        toggleImportant(selectedMessage.id, e);
                      }}
                      className="text-muted-foreground hover:text-amber-500"
                    >
                      {selectedMessage.isImportant ? (
                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      ) : (
                        <Star className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 p-6">
                <div className="prose prose-sm max-w-none">
                  <p>{selectedMessage.content}</p>

                  {selectedMessage.attachments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-medium">
                        Attachments ({selectedMessage.attachments.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="hover:bg-muted/50 flex cursor-pointer items-center rounded-md border p-3"
                          >
                            <Paperclip className="text-muted-foreground mr-2 h-4 w-4" />
                            <span className="text-sm">{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Reply
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Forward
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-6 text-center">
              <MessageCircle className="mb-4 h-12 w-12 opacity-20" />
              <h3 className="mb-1 text-lg font-medium">No message selected</h3>
              <p className="text-sm">Select a message to read it here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
