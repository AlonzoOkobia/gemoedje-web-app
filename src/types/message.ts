export interface Sender {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
}

export interface Message {
  id: string;
  sender: Sender;
  content: string;
  timestamp: string;
  status: "read" | "unread";
  isImportant: boolean;
  attachments: Attachment[];
}

export interface MessageStore {
  messages: Message[];
  markMessageAsRead: (id: string) => void;
}
