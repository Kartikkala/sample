export const metadata = {
    title: 'Chat Page',
  };
  
  export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <main className="container mx-auto p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            {children}
          </div>
        </main>
      </div>
    );
  }
  