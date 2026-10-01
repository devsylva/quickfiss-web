"use client";

import { useEffect, useState, useRef } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Sms, SearchNormal1, MessageQuestion, Send2, DocumentUpload } from "iconsax-react";
import { chatApi } from "@/lib/api/chat";
import type { ChatRoom, ChatMessage } from "@/types/api";

export default function ChatsPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchRooms() {
      setIsLoadingRooms(true);
      try {
        const data = await chatApi.getChatRooms();
        if (isMounted) {
          setRooms(Array.isArray(data) ? data : []);
          if (data && data.length > 0) {
            setSelectedRoom((current) => current || data[0]);
          }
        }
      } catch {
        // Fallback for preview
      } finally {
        if (isMounted) setIsLoadingRooms(false);
      }
    }

    fetchRooms();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!selectedRoom) return;

    async function fetchMessages() {
      setIsLoadingMessages(true);
      try {
        const data = await chatApi.getRoomMessages(selectedRoom!.id);
        if (isMounted) {
          setMessages(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isMounted) setMessages([]);
      } finally {
        if (isMounted) setIsLoadingMessages(false);
      }
    }

    fetchMessages();
    return () => {
      isMounted = false;
    };
  }, [selectedRoom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedRoom || isSending) return;

    const content = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      const newMsg = await chatApi.sendTextMessage(selectedRoom.id, content);
      setMessages((prev) => [...prev, newMsg]);
    } catch {
      // Local optimistic append
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          content,
          message_type: "text",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedRoom) return;

    try {
      const newMsg = await chatApi.sendFileMessage(selectedRoom.id, file);
      setMessages((prev) => [...prev, newMsg]);
    } catch {
      // Handle error
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const name = r.artisan?.name || r.artisan?.first_name || r.artisan?.business_name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <DashboardShell>
      <div className="flex h-full flex-col lg:flex-row">
        {/* Chats Sidebar */}
        <div className="flex w-full flex-col border-b border-border bg-white lg:h-full lg:w-80 lg:border-b-0 lg:border-r xl:w-96">
          <div className="border-b border-border p-4 lg:p-6">
            <h1 className="text-2xl font-extrabold text-foreground">Messages</h1>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-zinc-50/70 px-3 py-2 text-sm text-muted">
              <SearchNormal1 size={16} color="#a1a1aa" variant="Linear" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-foreground placeholder-zinc-400 outline-none text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingRooms ? (
              <div className="flex flex-col items-center justify-center p-8 text-xs text-muted">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="mt-2">Loading chats...</span>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Sms size={24} color="#3d5afe" variant="Bold" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">No conversations yet</p>
                <p className="mt-1 text-xs text-muted">
                  Direct messages with service providers will appear here when you message or book them.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredRooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  const name =
                    room.artisan?.name ||
                    room.artisan?.first_name ||
                    room.artisan?.business_name ||
                    "Artisan";
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoom(room)}
                      className={`flex w-full items-center gap-3 p-4 text-left transition-colors ${
                        isSelected ? "bg-primary-light/50" : "hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                        {name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                          {room.unread_count ? (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                              {room.unread_count}
                            </span>
                          ) : null}
                        </div>
                        <p className="truncate text-xs text-muted">
                          {room.last_message?.content || "Click to open conversation"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Conversation View Area on Desktop */}
        {selectedRoom ? (
          <div className="flex flex-1 flex-col bg-white">
            {/* Chat Room Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                  {(selectedRoom.artisan?.name || "A").charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {selectedRoom.artisan?.name || selectedRoom.artisan?.business_name || "Artisan"}
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-medium">Online</span>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {isLoadingMessages ? (
                <div className="flex justify-center p-8 text-xs text-muted">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted">
                  <p>Send a message to start coordinating with this provider.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col items-end">
                    <div className="max-w-md rounded-2xl bg-primary px-4 py-2.5 text-xs text-white">
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-border p-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-foreground"
              >
                <DocumentUpload size={20} color="currentColor" variant="Linear" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-zinc-50 px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send2 size={18} color="#ffffff" variant="Bold" />
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden flex-1 flex-col items-center justify-center bg-zinc-50/50 p-12 text-center lg:flex">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xs text-zinc-400">
              <MessageQuestion size={32} color="#a1a1aa" variant="Linear" />
            </div>
            <h2 className="mt-4 text-base font-bold text-foreground">Select a conversation</h2>
            <p className="mt-1 max-w-sm text-xs text-muted">
              Send inquiries, ask for quotes, and coordinate arrival times directly with your chosen artisan.
            </p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
