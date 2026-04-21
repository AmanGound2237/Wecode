"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function WeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Wecode AI Tutor [online]. How can I help you hack the matrix today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleWidget = () => setIsOpen((prev) => !prev);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: `Error: ${data.error || "Connection failed."}` },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error: Failed to connect to neural network." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono">
      {!isOpen && (
        <button
          onClick={toggleWidget}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-transform hover:scale-110 active:scale-95"
          aria-label="Open AI Tutor"
        >
          <span className="text-xl font-bold">{">_"}</span>
        </button>
      )}

      {isOpen && (
        <div className="flex h-96 w-80 flex-col overflow-hidden rounded-sm border-2 border-green-500 bg-black shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-green-500/50 bg-green-950/30 px-4 py-2">
            <span className="text-sm font-bold text-green-400">Terminal // AI Tutor</span>
            <button
              onClick={toggleWidget}
              className="text-green-500 hover:text-green-300"
              aria-label="Close Chat"
            >
              [x]
            </button>
          </div>

          {/* Chat History */}
          <div className="scrollbar-cyber flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded p-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-green-900/20 text-gray-400 border border-green-900/50"
                      : "bg-green-500/10 text-green-400 border border-green-500/30"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-pre:bg-black/50 prose-pre:border-green-500/30">
                       <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-green-500/10 text-green-400 border border-green-500/30 max-w-[85%] rounded p-2 text-sm">
                  <span className="animate-pulse">processing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-green-500/50 bg-black p-2">
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold ml-1">{">"}</span>
              <input
                type="text"
                className="flex-1 bg-transparent px-2 py-1 text-sm text-green-400 outline-none placeholder:text-green-800"
                placeholder="Ask about your code..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="text-xs text-green-500 hover:bg-green-900/30 px-2 py-1 transition-colors disabled:opacity-50 border border-green-500/50"
              >
                [send]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
