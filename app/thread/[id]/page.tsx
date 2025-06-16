import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";

export default async function ThreadPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
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
    redirect("/");
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={thread.messages} />
      </div>
      <div className="border-t p-4">
        <MessageInput threadId={thread.id} />
      </div>
    </div>
  );
} 