"use client";

import Image from "next/image";
import { ArrowLeft2, SearchNormal1 } from "iconsax-react";
import type { ChatConversationItem } from "@/types/chat";

interface ChatListViewProps {
  conversations: ChatConversationItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeTab: "unread" | "read";
  onTabChange: (tab: "unread" | "read") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBack?: () => void;
  showBack?: boolean;
}

export function ChatListView({
  conversations,
  selectedId,
  onSelect,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onBack,
  showBack = false,
}: ChatListViewProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-zinc-100"
            >
              <ArrowLeft2 size={18} color="#18181b" variant="Linear" />
            </button>
          )}
          <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">Chats</h1>
        </div>
      </div>

      {/* Search Input Bar (Matching Figma Mockup 1 & 3) */}
      <div className="px-4 pt-3 pb-2 sm:px-6">
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-2.5 transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
          <SearchNormal1 size={17} color="#9ca3af" variant="Linear" className="shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Artisans, services or providers"
            className="ml-2.5 w-full bg-transparent text-xs font-medium text-foreground placeholder-zinc-400 outline-none sm:text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="text-xs text-muted hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Segmented Filter Tabs: Unread | Read (Matching Figma Underline Tab) */}
      <div className="flex items-center border-b border-border/60 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onTabChange("unread")}
          className={`relative py-3 pr-4 text-xs font-extrabold transition-colors sm:text-sm ${
            activeTab === "unread" ? "text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          <span>Unread</span>
          {activeTab === "unread" && (
            <span className="absolute bottom-0 left-0 right-4 h-0.5 rounded-full bg-foreground" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange("read")}
          className={`relative px-4 py-3 text-xs font-extrabold transition-colors sm:text-sm ${
            activeTab === "read" ? "text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          <span>Read</span>
          {activeTab === "read" && (
            <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-foreground" />
          )}
        </button>
      </div>

      {/* Conversation List / Empty State */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          /* Empty State Illustration (Matching Figma Mockup 5) */
          <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center sm:py-20">
            {/* 3 Message bubble skeletons illustration with initials */}
            <div className="relative mb-6 flex flex-col items-center gap-2.5">
              {/* Bubble 1: SF */}
              <div className="flex w-64 items-center gap-3 rounded-2xl border border-zinc-100 bg-[#f9fafb] p-3 shadow-2xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-300 text-xs font-bold text-white">
                  SF
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="h-2.5 w-20 rounded-full bg-zinc-200" />
                  <div className="h-2 w-36 rounded-full bg-zinc-200/80" />
                </div>
              </div>

              {/* Bubble 2: VN (offset slightly) */}
              <div className="flex w-64 items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-3 shadow-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-400 text-xs font-bold text-white">
                  VN
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="h-2.5 w-24 rounded-full bg-zinc-200" />
                  <div className="h-2 w-40 rounded-full bg-zinc-200/80" />
                </div>
              </div>

              {/* Bubble 3: MS */}
              <div className="flex w-64 items-center gap-3 rounded-2xl border border-zinc-100 bg-[#f9fafb] p-3 shadow-2xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-300 text-xs font-bold text-white">
                  MS
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="h-2.5 w-20 rounded-full bg-zinc-200" />
                  <div className="h-2 w-36 rounded-full bg-zinc-200/80" />
                </div>
              </div>
            </div>

            <h3 className="text-base font-extrabold text-foreground sm:text-lg">
              No Conversations Yet
            </h3>
            <p className="mt-1.5 max-w-xs text-xs text-muted sm:text-sm">
              Start a new chat or invite others to join the conversation.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {conversations.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors sm:px-6 ${
                    isSelected ? "bg-primary-light/50" : "hover:bg-zinc-50"
                  }`}
                >
                  {/* User Avatar with Green Online Dot */}
                  <div className="relative shrink-0">
                    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 ring-border">
                      {item.recipientAvatar ? (
                        <Image
                          src={item.recipientAvatar}
                          alt={item.recipientName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-zinc-600">
                          {item.recipientName.charAt(0)}
                        </span>
                      )}
                    </div>
                    {item.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>

                  {/* Name, Snippet & Timestamp */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="truncate text-sm font-bold text-foreground sm:text-base">
                        {item.recipientName}
                      </h4>
                      <span className="shrink-0 text-[11px] text-muted">
                        {item.timestamp}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-zinc-500">
                        {item.lastMessage}
                      </p>
                      {item.isUnread && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
