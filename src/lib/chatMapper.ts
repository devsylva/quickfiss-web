import type { ChatMessage, ChatRoom } from "@/types/api";
import type { ChatConversationItem, ChatMessageItem } from "@/types/chat";

const clock = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false });
};

/** "14:05" today, "Yesterday", otherwise "3 Oct". */
export function listTime(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const days = Math.floor((startOfToday.getTime() - d.getTime()) / 86400000) + 1;
  if (d >= startOfToday) return clock(iso);
  if (days <= 1) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function messageToItem(m: ChatMessage, meId: number): ChatMessageItem {
  const mine = Number(m.sender) === meId;
  return {
    id: m.id,
    senderId: m.sender,
    senderName: m.sender_name || "",
    isMe: mine,
    text: m.content || undefined,
    image: m.file_url || undefined,
    timestamp: clock(m.timestamp),
    status: mine ? (m.is_read ? "read" : "sent") : undefined,
  };
}

const personName = (p: { full_name?: string; first_name?: string; last_name?: string }) =>
  p.full_name?.trim() || [p.first_name, p.last_name].filter(Boolean).join(" ") || "";

/** A room as the signed-in user sees it: the other side is the "recipient". */
export function roomToConversation(
  room: ChatRoom,
  role: "customer" | "provider",
  messages: ChatMessageItem[] = [],
): ChatConversationItem {
  const other = role === "customer" ? room.artisan : room.client;
  const name =
    (role === "customer" && room.artisan.business_name) || personName(other) || (role === "customer" ? "Provider" : "Customer");
  const last = room.last_message;
  return {
    id: room.id,
    recipientId: String(other.user.id),
    recipientName: name,
    recipientAvatar: other.profile_picture || "",
    recipientRole: role === "customer" ? "provider" : "customer",
    isOnline: role === "customer" ? (room.artisan.is_online ?? null) : null,
    lastMessage: last ? last.content || "Sent a photo" : "No messages yet",
    timestamp: listTime(last?.timestamp ?? room.updated_at),
    isUnread: (room.unread_count ?? 0) > 0,
    unreadCount: room.unread_count ?? 0,
    messages,
  };
}
