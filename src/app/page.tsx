import ChatPanel from "./ChatPanel";

export default function Home() {
  return (
    <main className="flex-1 px-6 py-14 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold tracking-widest text-accent">
          01 / TRỢ GIẢNG AI
        </p>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tight">
            Một câu hỏi về AI.
            <br />
            Một câu trả lời <span className="text-accent">ngay lập tức.</span>
          </h1>
          <p className="text-base text-foreground/60 leading-relaxed lg:pt-2">
            Hỏi bất cứ điều gì về LLM, prompt engineering hay cách dùng API —
            trợ giảng AI trả lời ngắn gọn, trực tiếp bằng tiếng Việt, theo
            từng chữ khi được sinh ra.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:items-stretch lg:h-[640px]">
          <div className="rounded-[28px] bg-surface p-6 sm:p-8 shadow-sm border border-tan h-full">
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
          </div>

          <ChatPanel />
        </div>

        <p className="mt-10 text-xs text-foreground/40">
          Mô hình chạy qua Ollama Cloud (gpt-oss). Câu trả lời có thể chưa
          hoàn toàn chính xác — hãy kiểm chứng lại với tài liệu chính thức.
        </p>
      </div>
    </main>
  );
}
