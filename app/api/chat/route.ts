import { NextRequest } from "next/server";
import { streamModelResponse } from "@/lib/modelService";
import { ModelType } from "@/lib/models";

export const runtime = "edge"; // or "nodejs" if you need node APIs

export async function POST(req: NextRequest) {
  const { message, model } = await req.json();
  const encoder = new TextEncoder();

  console.log("message", message);
  console.log("model", model);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamModelResponse(model as ModelType, message)) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (err) {
        console.error("Model streaming error:", err); // <-- Add this line

        controller.enqueue(encoder.encode("Error getting response."));
        controller.close();
      }
    }
  });
  console.log("stream", stream);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
