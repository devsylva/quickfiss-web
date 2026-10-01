import { apiClient } from "./client";
import type { ChatRoom, ChatMessage, MarkMessagesReadPayload } from "@/types/api";

export const chatApi = {
  /**
   * Get all chat rooms for the authenticated user
   */
  getChatRooms: () => {
    return apiClient<ChatRoom[]>("/api/chat/rooms/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Create a new chat room between client and artisan
   */
  createChatRoom: (artisan_id: number) => {
    return apiClient<ChatRoom>("/api/chat/rooms/create/", {
      method: "POST",
      body: { artisan_id },
      requiresAuth: true,
    });
  },

  /**
   * Get all messages in a chat room
   */
  getRoomMessages: (roomId: string) => {
    return apiClient<ChatMessage[]>(`/api/chat/rooms/${roomId}/messages/`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Send a text message
   */
  sendTextMessage: (roomId: string, content: string) => {
    return apiClient<ChatMessage>(`/api/chat/rooms/${roomId}/send/`, {
      method: "POST",
      body: {
        message_type: "text",
        content,
      },
      requiresAuth: true,
    });
  },

  /**
   * Send a file message (multipart/form-data)
   */
  sendFileMessage: (roomId: string, file: File) => {
    const formData = new FormData();
    formData.append("message_type", "file");
    formData.append("file", file);

    return apiClient<ChatMessage>(`/api/chat/rooms/${roomId}/send/`, {
      method: "POST",
      body: formData,
      requiresAuth: true,
    });
  },

  /**
   * Mark messages as read
   */
  markMessagesRead: (roomId: string, payload: MarkMessagesReadPayload) => {
    return apiClient<{ success: boolean }>(`/api/chat/rooms/${roomId}/mark-read/`, {
      method: "PATCH",
      body: payload,
      requiresAuth: true,
    });
  },
};
