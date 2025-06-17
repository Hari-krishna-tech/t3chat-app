import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { content, threadId, isAi } = body;

    if (!content || !threadId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        userId: isAi ? 'ai' : user.id, // Use 'ai' as userId for AI messages
        threadId,
      },
      include: {
        user: true,
      },
    });

    // If this is an AI message, create a system user for it
    if (isAi) {
      message.user = {
        id: 'ai',
        name: 'AI Assistant',
        email: null,
        emailVerified: null,
        image: null,
        createdAt: new Date(),
      };
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("[MESSAGE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 