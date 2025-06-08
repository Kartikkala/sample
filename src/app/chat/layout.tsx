import Messages from "../components/chat/Messages";

export const metadata = {
  title: 'Chat Page',
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="first-background-color first-text-color d-flex flex-column flex-grow-1">
      <main className="d-flex flex-column flex-grow-1">
        <Messages />
        <div className="second-background-color rounded shadow py-3 border first-border-color">
          {children}
        </div>
      </main>
    </div>
  );
}
