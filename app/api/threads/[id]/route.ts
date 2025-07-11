import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const thread = await prisma.thread.findUnique({
      where: {
        id: params.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: true,
          },
        },
      },
    });

    if (!thread) {
      return new NextResponse("Thread not found", { status: 404 });
    }

    // Modify AI messages to show proper user information
    const messages = thread.messages.map(message => ({
      ...message,
      user: message.isAi ? {
        ...message.user,
        name: 'AI Assistant',
        image: null,
      } : message.user
    }));

    return NextResponse.json({ ...thread, messages });
  } catch (error) {
    console.error("[THREAD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 