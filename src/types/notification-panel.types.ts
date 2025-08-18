export type NotificationType =
  | "specialty_approved"
  | "specialty_rejected"
  | "default";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}

export interface NotificationsPanelProps {
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
}
