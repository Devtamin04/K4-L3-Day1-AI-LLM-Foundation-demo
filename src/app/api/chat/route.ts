import OpenAI from "openai";

export const runtime = "nodejs";

const PERSONA =
  "Bạn là trợ giảng thân thiện của khóa AI, trả lời ngắn gọn bằng tiếng Việt.";

export const AVAILABLE_MODELS = [
  "gpt-oss:120b",
  "gpt-oss:20b",
  "gemma4:31b",
  "nemotron-3-nano:30b",
] as const;

type AvailableModel = (typeof AVAILABLE_MODELS)[number];

// USD ước tính / 1K token — mô phỏng bảng giá gpt-4o / gpt-4o-mini trong lab,
// vì Ollama Cloud không công bố giá theo token cho các model open-weight này.
const PRICING_PER_1K_TOKENS: Record<AvailableModel, { input: number; output: number }> = {
  "gpt-oss:120b": { input: 0.0025, output: 0.01 },
  "gpt-oss:20b": { input: 0.00015, output: 0.0006 },
  "gemma4:31b": { input: 0.0002, output: 0.0008 },
  "nemotron-3-nano:30b": { input: 0.0002, output: 0.0008 },
};

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function GET() {
  return Response.json({ models: AVAILABLE_MODELS });
}

export async function POST(req: Request) {
  const {
    messages,
    model,
  }: { messages: ChatMessage[]; model?: string } = await req.json();

  const selectedModel: AvailableModel = AVAILABLE_MODELS.includes(
    model as AvailableModel
  )
    ? (model as AvailableModel)
    : "gpt-oss:120b";

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const stream = await client.chat.completions.create({
    model: selectedModel,
    messages: [{ role: "system", content: PERSONA }, ...messages],
    stream: true,
    stream_options: { include_usage: true },
  });

  const pricing = PRICING_PER_1K_TOKENS[selectedModel];
  const encoder = new TextEncoder();

  // NDJSON: mỗi dòng là một sự kiện {type: "delta" | "usage", ...}, tránh
  // trộn lẫn marker vào nội dung text mà model có thể vô tình lặp lại.
  const body = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) {
            controller.enqueue(
              encoder.encode(JSON.stringify({ type: "delta", text: delta }) + "\n")
            );
          }

          if (chunk.usage) {
            const { prompt_tokens, completion_tokens } = chunk.usage;
            const inputCost = (prompt_tokens / 1000) * pricing.input;
            const outputCost = (completion_tokens / 1000) * pricing.output;
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: "usage",
                  model: selectedModel,
                  inputTokens: prompt_tokens,
                  outputTokens: completion_tokens,
                  inputCost,
                  outputCost,
                  totalCost: inputCost + outputCost,
                }) + "\n"
              )
            );
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}
