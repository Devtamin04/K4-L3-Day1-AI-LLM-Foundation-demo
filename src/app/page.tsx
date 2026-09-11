import ChatSection from "./ChatSection";

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

        <ChatSection />

        <p className="mt-10 text-xs text-foreground/40">
          Mô hình chạy qua Ollama Cloud (gpt-oss). Câu trả lời có thể chưa
          hoàn toàn chính xác — hãy kiểm chứng lại với tài liệu chính thức.
        </p>
      </div>
    </main>
  );
}
