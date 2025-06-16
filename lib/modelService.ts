import { ModelType } from "./models";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function* streamModelResponse(model: ModelType, prompt: string) {
  switch (model) {
    case "gemini-pro":
      yield* streamGeminiResponse(prompt);
      break;
    case "gemini-2.0-flash":
      yield* streamGemini20FlashResponse(prompt);
      break;
    case "gpt-4":
    case "gpt-3.5-turbo":
      // TODO: Implement OpenAI streaming
      throw new Error("OpenAI streaming not implemented yet");
    case "claude-3-opus":
      // TODO: Implement Claude streaming
      throw new Error("Claude streaming not implemented yet");
    default:
      throw new Error(`Model ${model} not supported`);
  }
}

async function* streamGemini20FlashResponse(prompt: string) {
  try {
    // add system prompt
    const systemPrompt = "You are a helpful assistant. answer in markdown format. be concise and to the point.";
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContentStream(systemPrompt + "\n\n" + prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Error in Gemini streaming:", error);
    throw error;
  }
}

async function* streamGeminiResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Error in Gemini streaming:", error);
    throw error;
  }
} 