"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft2,
  Send2,
  CloseCircle,
  TickCircle,
} from "iconsax-react";
import type { ChatConversationItem, ChatMessageItem } from "@/types/chat";

interface ChatDetailViewProps {
  conversation: ChatConversationItem;
  onBack?: () => void;
  showBack?: boolean;
  onSendMessage: (conversationId: string, text: string, file?: File) => void;
}

export function ChatDetailView({
  conversation,
  onBack,
  showBack = false,
  onSendMessage,
}: ChatDetailViewProps) {
  const [inputText, setInputText] = useState("");
  const [showMediaTray, setShowMediaTray] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message on update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedImage) return;

    onSendMessage(conversation.id, inputText.trim(), attachedFile || undefined);
    setInputText("");
    setAttachedImage(null);
    setAttachedFile(null);
    setShowMediaTray(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (!file.type.startsWith("image/")) return setFileError("Only photos can be sent.");
    if (file.size > 5 * 1024 * 1024) return setFileError("That photo is larger than 5MB.");
    setFileError(null);
    const url = URL.createObjectURL(file);
    setAttachedFile(file);
    setAttachedImage(url);
    setShowMediaTray(true);
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* Chat Header Bar (Matching Figma Mockup 2 & 4) */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to chats"
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-zinc-100"
            >
              <ArrowLeft2 size={20} color="#18181b" variant="Linear" />
            </button>
          )}

          {/* Recipient Avatar with Green Online Dot */}
          <div className="relative">
            <div className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-border">
              {conversation.recipientAvatar ? (
                <Image
                  src={conversation.recipientAvatar}
                  alt={conversation.recipientName}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-light text-primary font-bold">
                  {conversation.recipientName.charAt(0)}
                </div>
              )}
            </div>
            {conversation.isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            )}
          </div>

          {/* Name & Online Status */}
          <div>
            <h3 className="text-sm font-extrabold text-foreground sm:text-base">
              {conversation.recipientName}
            </h3>
            {conversation.isOnline !== null && (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                {conversation.isOnline ? (
                  <span className="text-emerald-600 font-medium">Available</span>
                ) : (
                  <span>Offline</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* More Options Icon (⋮) */}
        <button
          type="button"
          aria-label="More options"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Message Feed Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-4">
        {conversation.messages.map((msg: ChatMessageItem) => {
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-md ${
                  msg.isMe
                    ? "rounded-2xl rounded-tr-xs bg-primary px-4 py-3 text-sm text-white shadow-2xs"
                    : "rounded-2xl rounded-tl-xs bg-[#f4f4f5]/90 px-4 py-3 text-sm text-foreground shadow-2xs"
                }`}
              >
                {/* Embedded Image if any */}
                {msg.image && (
                  <div className="relative mb-2.5 h-44 w-full sm:h-52 overflow-hidden rounded-xl">
                    <Image
                      src={msg.image}
                      alt="Attachment"
                      fill
                      sizes="(max-width: 768px) 85vw, 400px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Text Content */}
                {msg.text && <p className="leading-relaxed">{msg.text}</p>}
              </div>

              {/* Timestamp & Delivery Checkmark */}
              <div className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                <span>{msg.failed ? "Not sent" : msg.pending ? "Sending..." : msg.timestamp}</span>
                {msg.isMe && !msg.pending && !msg.failed && (
                  <span className="flex items-center text-primary">
                    <TickCircle size={13} color="#3d5afe" variant="Bold" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Media Attachment Tray (Matching Figma Mockup 4) */}
      {showMediaTray && (
        <div className="border-t border-border/50 bg-[#fafafa] px-4 py-3 sm:px-6 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            {attachedImage ? (
              <div className="group relative h-20 w-20 overflow-hidden rounded-2xl border border-zinc-200 shadow-2xs">
                <Image
                  src={attachedImage}
                  alt="Attached preview"
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAttachedImage(null);
                    setAttachedFile(null);
                  }}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600"
                >
                  <CloseCircle size={14} color="#ffffff" />
                </button>
              </div>
            ) : null}

            {/* Plus / Add Media button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary-light/40 text-primary transition-all hover:bg-primary-light"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </button>

            {fileError && <span className="text-xs font-medium text-red-600">{fileError}</span>}
          </div>
        </div>
      )}

      {/* Bottom Message Composer (Matching Figma Mockup 2 & 4) */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-border/60 bg-white px-4 py-3 sm:px-6"
      >
        <div className="flex flex-1 items-center rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-2.5 transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-transparent text-xs font-medium text-foreground placeholder-zinc-400 outline-none sm:text-sm"
          />

          <div className="flex items-center gap-2.5 text-zinc-500">
            {/* Clear / Dismiss media button if media is attached */}
            {attachedImage && (
              <button
                type="button"
                onClick={() => {
                  setAttachedImage(null);
                  setAttachedFile(null);
                  setShowMediaTray(false);
                }}
                className="text-zinc-400 hover:text-foreground"
              >
                <CloseCircle size={18} color="currentColor" />
              </button>
            )}

            {/* Smiley Emoji button */}
            <button
              type="button"
              onClick={() => setInputText((prev) => `${prev} 😊`)}
              aria-label="Add emoji"
              className="text-zinc-400 hover:text-foreground"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="12" r="9" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth={2.5} strokeLinecap="round" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth={2.5} strokeLinecap="round" />
              </svg>
            </button>

            {/* Paperclip Attachment button */}
            <button
              type="button"
              onClick={() => setShowMediaTray((prev) => !prev)}
              aria-label="Attach file"
              className={`transition-colors ${
                showMediaTray || attachedImage ? "text-primary" : "text-zinc-400 hover:text-foreground"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Send Button (Blue Paper Plane Send2) */}
        <button
          type="submit"
          disabled={!inputText.trim() && !attachedImage}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm transition-all hover:bg-primary-dark active:scale-95 disabled:opacity-40"
        >
          <Send2 size={18} color="#ffffff" variant="Bold" />
        </button>
      </form>
    </div>
  );
}
