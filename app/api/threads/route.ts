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
    const { title, message } = body;

    if (!title || !message) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create thread and first message in a transaction
    const thread = await prisma.$transaction(async (tx) => {
      // Create the thread
      const newThread = await tx.thread.create({
        data: {
          title,
          userId: user.id,
        },
      });

      // Create the first message
      const newMessage = await tx.message.create({
        data: {
          content: message,
          userId: user.id,
          threadId: newThread.id,
        },
      });

      return {
        ...newThread,
        messages: [newMessage],
      };
    });

    return NextResponse.json(thread);
  } catch (error) {
    console.error("[THREAD_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const threads = await prisma.thread.findMany({
      where: {
        userId: user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(threads);
  } catch (error) {
    console.error("[THREAD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 