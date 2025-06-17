import { ModelType } from "./models";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

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
  // Convert messages to string if needed
  let messageString = "";
  if(isTitle) {
    messageString = messages as string;
  } else {
    messageString = Array.isArray(messages)
    // here m is the MessageType
    ? messages.map(m => m.content).join("\n\n")
    : messages;
  }

  switch (model) {
    case "gemini-pro":
      yield* streamGeminiResponse(messageString);
      break;
    case "gemini-2.0-flash":
      yield* streamGemini20FlashResponse(messageString); 
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

async function* streamGemini20FlashResponse(message: string) {
  try {
    // add system prompt
    const systemPrompt = "You are a helpful assistant. answer in markdown format. be concise and to the point.";
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContentStream(systemPrompt + "\n\n" + message);

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

async function* streamGeminiResponse(message: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContentStream(message);
    
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