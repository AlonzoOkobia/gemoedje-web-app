import { Notification } from "../types/notification-panel.types";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Specialty Approved",
    message: "Your specialty request has been approved by the admin team.",
    type: "specialty_approved",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: "2",
    title: "Specialty Rejected",
    message:
      "Your specialty request has been rejected. Please review the requirements.",
    type: "specialty_rejected",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
  {
    id: "3",
    title: "New Message",
    message: "You have a new message from the support team.",
    type: "default",
    timestamp: new Date(Date.now() - 8640000).toISOString(),
    read: false,
  },
];
