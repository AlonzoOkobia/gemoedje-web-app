"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockNotifications } from "@/mock-data/notification-panel.mock";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Bell, Star } from "lucide-react";

export function NotificationsPanel() {
  const notifications = mockNotifications;
  const markNotificationAsRead = (id: string) => {};

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "specialty_approved":
        return <Star className="h-5 w-5 text-amber-500" />;
      case "specialty_rejected":
        return <AlertCircle className="text-destructive h-5 w-5" />;
      default:
        return <Bell className="text-primary h-5 w-5" />;
    }
  };

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <h2 className="text-2xl font-bold">Notifications</h2>
      </CardHeader>
      <CardContent className="h-full">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg p-4 ${
                  !notification.read ? "bg-primary/5" : "bg-background"
                }`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <div className="text-primary mt-2 flex items-center text-xs">
                        <div className="bg-primary mr-2 h-2 w-2 rounded-full" />
                        New
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
