export interface ChatMessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  isMe: boolean;
  text?: string;
  image?: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  /** True while a message is on its way to the server. */
  pending?: boolean;
  failed?: boolean;
}

export interface ChatConversationItem {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  recipientRole: "provider" | "customer";
  serviceCategory?: string;
  /** null when we don't know (customers don't publish a status). */
  isOnline: boolean | null;
  lastMessage: string;
  timestamp: string;
  isUnread: boolean;
  unreadCount?: number;
  messages: ChatMessageItem[];
}
