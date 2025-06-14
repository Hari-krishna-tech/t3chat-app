import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="flex h-screen">
      <ChatSidebar />
      <ChatWindow />
    </main>
  );
}
