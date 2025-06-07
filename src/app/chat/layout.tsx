import Messages from "../components/chat/Messages";

export const metadata = {
  title: 'Chat Page',
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-dark text-white d-flex flex-column flex-grow-1">
      <main className="d-flex flex-column flex-grow-1">
        <Messages />
        <div className="bg-secondary rounded shadow p-4 border border-white">
          {children}
        </div>
      </main>
    </div>
  );
}
