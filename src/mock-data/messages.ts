import { Message } from "@/types/message";

export const mockMessages: Message[] = [
  {
    id: "1",
    sender: {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "/avatars/user1.jpg",
      role: "Admin",
    },
    content:
      "Hi there! I noticed some issues with the recent updates. Could we discuss the changes made in the last sprint?",
    timestamp: "2025-05-26T14:30:00",
    status: "unread",
    isImportant: true,
    attachments: [{ id: "att1", name: "sprint_report.pdf", type: "document" }],
  },
  {
    id: "2",
    sender: {
      id: "user2",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/avatars/user2.jpg",
      role: "Developer",
    },
    content:
      "The new feature deployment is scheduled for tomorrow at 10 AM. Please review the deployment checklist.",
    timestamp: "2025-05-26T11:45:00",
    status: "read",
    isImportant: false,
    attachments: [],
  },
  {
    id: "3",
    sender: {
      id: "user3",
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "/avatars/user3.jpg",
      role: "QA Engineer",
    },
    content:
      "I found a bug in the login flow. Could you please check the error logs?",
    timestamp: "2025-05-25T16:20:00",
    status: "unread",
    isImportant: true,
    attachments: [{ id: "att2", name: "error_logs.txt", type: "text" }],
  },
  {
    id: "4",
    sender: {
      id: "user4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/avatars/user4.jpg",
      role: "Project Manager",
    },
    content: "Weekly team meeting reminder: Today at 3 PM. Agenda attached.",
    timestamp: "2025-05-26T09:00:00",
    status: "read",
    isImportant: true,
    attachments: [
      { id: "att3", name: "meeting_agenda.docx", type: "document" },
    ],
  },
  {
    id: "5",
    sender: {
      id: "user5",
      name: "David Brown",
      email: "david@example.com",
      avatar: "/avatars/user5.jpg",
      role: "Support Specialist",
    },
    content:
      "Customer support dashboard has been updated with new metrics. Check the changelog.",
    timestamp: "2025-05-25T09:15:00",
    status: "unread",
    isImportant: false,
    attachments: [{ id: "att4", name: "changelog.md", type: "markdown" }],
  },
];
