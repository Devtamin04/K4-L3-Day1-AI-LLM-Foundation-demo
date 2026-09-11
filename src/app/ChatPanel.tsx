"use client";

import { useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Temperature khác top_p ở điểm nào?",
  "Vì sao nên dùng streaming cho chatbot?",
  "Giải thích exponential backoff bằng ví dụ đời thường.",
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || isStreaming) return;

    const nextMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.body) throw new Error("Không có phản hồi từ máy chủ.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const delta = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + delta,
          };
          return copy;
        });
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Xin lỗi, đã có lỗi khi kết nối tới trợ giảng AI.",
        };
        return copy;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="rounded-[28px] bg-surface-dark text-white p-6 sm:p-8 flex flex-col h-full min-h-0 shadow-xl">
      <div className="flex items-center gap-3 pb-5 border-b border-white/10">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white text-lg">
          🎓
        </span>
        <div>
          <p className="font-semibold leading-tight">Trợ giảng AI</p>
          <p className="text-xs text-white/50">Hỏi đáp trực tiếp · streaming</p>
        </div>
      </div>

      <div className="chat-scroll flex-1 min-h-0 overflow-y-auto py-5 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-white/50">Thử hỏi:</p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="block w-full text-left rounded-2xl bg-white/5 hover:bg-white/10 transition-colors px-4 py-3 text-sm"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-accent text-white rounded-br-sm"
                  : "bg-white/10 text-white rounded-bl-sm"
              }`}
            >
              {m.content || (isStreaming && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 pt-4 border-t border-white/10"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi của bạn..."
          disabled={isStreaming}
          className="flex-1 rounded-full bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white disabled:opacity-40 transition-opacity"
          aria-label="Gửi"
        >
          →
        </button>
      </form>
    </div>
  );
}
