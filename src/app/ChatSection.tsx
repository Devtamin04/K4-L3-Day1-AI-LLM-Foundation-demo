"use client";

import { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";

const FALLBACK_MODELS = ["gpt-oss:120b", "gpt-oss:20b"];

export default function ChatSection() {
  const [models, setModels] = useState<string[]>(FALLBACK_MODELS);
  const [selectedModel, setSelectedModel] = useState(FALLBACK_MODELS[0]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data: { models: string[] }) => {
        if (data.models?.length) {
          setModels(data.models);
          setSelectedModel(data.models[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:items-stretch lg:h-[640px]">
      <div className="rounded-[28px] bg-surface p-6 sm:p-8 shadow-sm border border-tan h-full flex flex-col">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tan text-accent text-lg">
          💡
        </div>
        <p className="mt-6 text-xs font-semibold tracking-widest text-foreground/40">
          02 / CÁCH DÙNG
        </p>
        <p className="mt-3 text-2xl font-semibold">3 bước</p>
        <p className="mt-1 text-sm text-foreground/60">
          để có câu trả lời đầu tiên
        </p>
        <ul className="mt-6 space-y-3 text-sm text-foreground/70">
          <li>1. Gõ câu hỏi vào ô chat bên phải</li>
          <li>2. Xem câu trả lời stream theo từng chữ</li>
          <li>3. Hỏi tiếp — trợ giảng nhớ ngữ cảnh cuộc trò chuyện</li>
        </ul>

        <p className="mt-8 text-xs font-semibold tracking-widest text-foreground/40">
          03 / CHỌN MODEL
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {models.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedModel(m)}
              disabled={isStreaming}
              className={`rounded-2xl px-3 py-3 text-xs font-medium text-left transition-colors disabled:opacity-50 ${
                m === selectedModel
                  ? "bg-accent text-white"
                  : "bg-tan/60 text-foreground/70 hover:bg-tan"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <ChatPanel model={selectedModel} onStreamingChange={setIsStreaming} />
    </div>
  );
}
