"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";
import SuggestedPrompts from "@/components/SuggestedPrompts";
import FloatingStars from "@/components/FloatingStars";
import { Message } from "./api/chat/route";

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi there! 👋 I'm **Zara**, your friendly parenting coach from Alpha Kids!\n\nI'm here to help with everyday parenting questions — from toddler tantrums to teen talk. You can write to me in **English or Urdu** 🌟\n\nWhat's on your mind today?",
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;

    const userMessage: Message = { role: "user", content: userText };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to get a response.";
      setError(msg);
      // Remove the user message on failure
      setMessages(messages);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handlePromptSelect = (prompt: string) => {
    sendMessage(prompt);
  };

  const isFirstMessage = messages.length === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-yellow-50 relative overflow-hidden">
      {/* Decorative floating elements */}
      <FloatingStars />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-200">
              <span className="text-2xl">🌟</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-tight">
              Zara
              <span className="ml-2 text-xs font-medium bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                AI Coach
              </span>
            </h1>
            <p className="text-xs text-gray-500">Alpha Kids · Parenting Support · EN / اردو</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Image
              src="/alpha-kids-logo.svg"
              alt="Alpha Kids"
              width={80}
              height={28}
              className="opacity-70"
              onError={() => {}} // graceful fallback
            />
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="max-w-3xl mx-auto px-4 pb-40 pt-6">
        {/* Disclaimer banner */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex gap-2 items-start text-xs text-amber-700">
          <span className="text-base mt-0.5">ℹ️</span>
          <span>
            Zara is an AI coach, not a doctor or therapist. For medical, legal, or mental health emergencies, please contact a professional or call emergency services.
          </span>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} index={i} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts (shown only at start) */}
        {isFirstMessage && !isLoading && (
          <SuggestedPrompts onSelect={handlePromptSelect} />
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700 flex gap-2 items-center">
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </main>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-purple-100 shadow-lg shadow-purple-100/50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your concern in English or Urdu... اردو میں لکھیں"
                rows={1}
                className="w-full resize-none rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 text-sm outline-none transition-all max-h-32 overflow-y-auto leading-relaxed"
                style={{ minHeight: "48px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 128) + "px";
                }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 flex-shrink-0"
              aria-label="Send message"
            >
              {isLoading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
