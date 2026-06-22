import { ModelType } from "./models";

type MessageType = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  isAi: boolean;
  user: {
    name: string | null;
    image: string | null;
  };
};

export async function* streamModelResponse(model: ModelType, messages: string | MessageType[], isTitle: boolean) {
  let openrouterMessages: { role: string; content: string }[] = [];

  if (isTitle) {
    // If it's a title request, it's just a single string prompt
    const promptString = typeof messages === "string" ? messages : "Suggest a short, relevant chat title";
    openrouterMessages = [
      { role: "user", content: promptString }
    ];
  } else {
    // If it's a conversation history, map it to the proper OpenAI roles
    const formattedMessages = Array.isArray(messages)
      ? messages.map((m) => ({
          role: m.isAi ? "assistant" : "user",
          content: m.content,
        }))
      : [{ role: "user", content: messages }];

    openrouterMessages = [
      { role: "system", content: "You are a helpful assistant. Answer in markdown format. Be concise and to the point." },
      ...formattedMessages
    ];
  }

  yield* streamOpenRouterResponse(model, openrouterMessages);
}

async function* streamOpenRouterResponse(modelId: string, messages: { role: string; content: string }[]) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("Missing OPENROUTER_API_KEY env variable");
    yield "Error: OPENROUTER_API_KEY is not configured.";
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://t3chat-app.vercel.app",
        "X-Title": "T3.chat",
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error (status ${response.status}):`, errorText);
      yield `Error calling OpenRouter: ${response.status} ${response.statusText}`;
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      yield "Error: Response body is not readable.";
      return;
    }

    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed === "data: [DONE]") continue;

        if (trimmed.startsWith("data: ")) {
          const jsonStr = trimmed.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.warn("Failed to parse SSE JSON chunk:", jsonStr, e);
          }
        }
      }
    }

    // Handle remaining buffer if any
    if (buffer && buffer.startsWith("data: ")) {
      const trimmed = buffer.trim();
      if (trimmed !== "data: [DONE]") {
        const jsonStr = trimmed.slice(6);
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch (e) {
          console.warn("Failed to parse SSE JSON chunk from final buffer:", jsonStr, e);
        }
      }
    }
  } catch (error) {
    console.error("Network error streaming OpenRouter response:", error);
    yield "Error: Failed to fetch streaming response from OpenRouter.";
  }
}