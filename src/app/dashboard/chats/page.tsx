"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ChatListView } from "@/components/chat/ChatListView";
import { ChatDetailView } from "@/components/chat/ChatDetailView";
import { chatApi } from "@/lib/api/chat";
import { messageToItem, roomToConversation } from "@/lib/chatMapper";
import { useAuthStore } from "@/store/useAuthStore";
import type { ChatMessage, ChatRoom } from "@/types/api";
import type { ChatMessageItem } from "@/types/chat";

const ROOM_POLL_MS = 10000;
const MESSAGE_POLL_MS = 4000;

function ChatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wantedRoom = searchParams.get("room");
  const { activeRole, initAuth, user } = useAuthStore();
  const meId = Number(user?.id ?? 0);

  const [tabChoice, setTabChoice] = useState<"unread" | "read" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [roomsLoaded, setRoomsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedIdState, setSelectedIdState] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesRoom, setMessagesRoom] = useState<string | null>(null);
  const [outbox, setOutbox] = useState<(ChatMessageItem & { roomId: string })[]>([]);
  const markedRead = useRef<Set<string>>(new Set());

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // The conversations list, refreshed every few seconds.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await chatApi.getChatRooms();
        if (cancelled) return;
        setRooms(Array.isArray(data) ? data : []);
        setLoadError(null);
      } catch (err: unknown) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "We couldn't load your chats.");
      } finally {
        if (!cancelled) setRoomsLoaded(true);
      }
    }
    load();
    const timer = setInterval(load, ROOM_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // Only the chats where the signed-in user is on this side of the app.
  const sideRooms = useMemo(
    () =>
      rooms.filter((room) =>
        activeRole === "provider" ? room.artisan.user.id === meId : room.client.user.id === meId,
      ),
    [rooms, activeRole, meId],
  );

  const selectedId = useMemo(() => {
    if (selectedIdState) return selectedIdState;
    if (wantedRoom && sideRooms.some((r) => r.id === wantedRoom)) return wantedRoom;
    return null;
  }, [selectedIdState, wantedRoom, sideRooms]);

  // Desktop shows the first chat when none is chosen; mobile shows the list.
  const activeId = selectedId ?? sideRooms[0]?.id ?? null;

  // The open conversation's messages, refreshed while it's open.
  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    async function load() {
      try {
        const data = await chatApi.getRoomMessages(activeId as string);
        if (cancelled) return;
        setMessages(Array.isArray(data) ? data : []);
        setMessagesRoom(activeId);
      } catch {
        // keep what we have; the next poll will try again
      }
    }
    load();
    const timer = setInterval(load, MESSAGE_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [activeId]);

  // Tell the server the other person's messages have been seen.
  useEffect(() => {
    if (!activeId || messagesRoom !== activeId || !meId) return;
    const unseen = messages.filter((m) => Number(m.sender) !== meId && !m.is_read && !markedRead.current.has(m.id));
    if (unseen.length === 0) return;
    unseen.forEach((m) => markedRead.current.add(m.id));
    chatApi
      .markMessagesRead(activeId, { message_ids: unseen.map((m) => m.id) })
      .then(() => setRooms((prev) => prev.map((r) => (r.id === activeId ? { ...r, unread_count: 0 } : r))))
      .catch(() => unseen.forEach((m) => markedRead.current.delete(m.id)));
  }, [messages, messagesRoom, activeId, meId]);

  const conversations = useMemo(
    () =>
      sideRooms.map((room) => {
        const live =
          room.id === activeId && messagesRoom === activeId
            ? messages.map((m) => messageToItem(m, meId))
            : [];
        const sending = outbox.filter((o) => o.roomId === room.id);
        return roomToConversation(room, activeRole, [...live, ...sending]);
      }),
    [sideRooms, activeId, messagesRoom, messages, outbox, activeRole, meId],
  );

  const unreadExists = conversations.some((c) => c.isUnread);
  const activeTab = tabChoice ?? (unreadExists ? "unread" : "read");

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return conversations.filter((conv) => {
      if (activeTab === "unread" && !conv.isUnread) return false;
      if (activeTab === "read" && conv.isUnread) return false;
      if (q && !conv.recipientName.toLowerCase().includes(q) && !conv.lastMessage.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [conversations, activeTab, searchQuery]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;
  const setSelectedId = (id: string | null) => setSelectedIdState(id);

  const handleSendMessage = useCallback(
    async (roomId: string, text: string, file?: File) => {
      const tempId = `pending-${Date.now()}`;
      const draft: ChatMessageItem & { roomId: string } = {
        id: tempId,
        roomId,
        senderId: String(meId),
        senderName: "",
        isMe: true,
        text: text || undefined,
        image: file ? URL.createObjectURL(file) : undefined,
        timestamp: "",
        pending: true,
      };
      setOutbox((prev) => [...prev, draft]);
      try {
        const sent = await chatApi.sendMessage(roomId, { content: text || undefined, file });
        setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
        setOutbox((prev) => prev.filter((o) => o.id !== tempId));
        setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, last_message: sent } : r)));
      } catch {
        setOutbox((prev) => prev.map((o) => (o.id === tempId ? { ...o, pending: false, failed: true } : o)));
      }
    },
    [meId],
  );

  if (!roomsLoaded) {
    return (
      <DashboardShell>
        <div className="flex h-full items-center justify-center text-sm text-muted">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-3">Loading your chats...</span>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      {loadError && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700">{loadError}</div>
      )}
      <div className="flex h-full w-full overflow-hidden bg-white">
        {/* ========================================================= */}
        {/* DESKTOP & TABLET: SIDE-BY-SIDE SPLIT SCREEN (>= 768px)    */}
        {/* ========================================================= */}
        <div className="hidden h-full w-full md:flex">
          {/* Left Pane: Chat List (width 320px on tablet, 380px on desktop) */}
          <div className="flex h-full w-80 shrink-0 flex-col border-r border-border/70 bg-white lg:w-96">
            <ChatListView
              conversations={filteredConversations}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              activeTab={activeTab}
              onTabChange={(tab) => setTabChoice(tab)}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              showBack={false}
            />
          </div>

          {/* Right Pane: Active Chat Detail or Select Prompt */}
          <div className="flex flex-1 flex-col overflow-hidden bg-[#fafafa]">
            {activeConversation ? (
              <ChatDetailView
                conversation={activeConversation}
                onSendMessage={handleSendMessage}
                showBack={false}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-extrabold text-foreground">
                  Select a Conversation
                </h3>
                <p className="mt-1 max-w-sm text-xs text-muted">
                  Choose a chat on the left to coordinate services, ask questions, or review attachments.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE (< 768px): SINGLE VIEW (Chat List OR Chat Detail) */}
        {/* ========================================================= */}
        <div className="flex h-full w-full flex-col md:hidden">
          {selectedId && activeConversation ? (
            /* Active Conversation View Full Screen */
            <ChatDetailView
              conversation={activeConversation}
              onBack={() => setSelectedId(null)}
              showBack={true}
              onSendMessage={handleSendMessage}
            />
          ) : (
            /* Chat List View */
            <ChatListView
              conversations={filteredConversations}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              activeTab={activeTab}
              onTabChange={(tab) => setTabChoice(tab)}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              onBack={() => router.push("/dashboard")}
              showBack={true}
            />
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

export default function ChatsPage() {
  return (
    <Suspense fallback={null}>
      <ChatsContent />
    </Suspense>
  );
}
