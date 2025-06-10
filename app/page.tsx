import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';

export default function Home() {
  return (
    <main className="flex h-screen">
      <ChatSidebar />
      <ChatWindow />
    </main>
  );
}
