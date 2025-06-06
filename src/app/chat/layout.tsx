export const metadata = {
  title: 'Chat Page',
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-dark text-white min-vh-100">
      <main className="container py-4">
        <div className="bg-secondary rounded shadow p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
