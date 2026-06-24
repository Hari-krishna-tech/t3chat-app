import { NextRequest } from "next/server";
import { streamModelResponse } from "@/lib/modelService";
import { ModelType } from "@/lib/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  let { messages, model, isTitle } = await req.json();
  const encoder = new TextEncoder();

  // Fetch user profile if authenticated
  let userProfile: {
    preferredName: string | null;
    occupation: string | null;
    traits: string | null;
    aboutUser: string | null;
  } | null = null;
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userProfile = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          preferredName: true,
          occupation: true,
          traits: true,
          aboutUser: true,
        },
      });
    }
  } catch (err) {
    console.error("Error fetching user profile for chat:", err);
  }

  console.log("messages", messages);
  console.log("model", model);
  console.log("userProfile", userProfile);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamModelResponse(model as ModelType, messages, isTitle, userProfile || undefined)) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (err) {
        console.error("Model streaming error:", err);

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
