'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, input]);
    setInput('');
  };

  return (
    <div className="container py-3">
      <div className="mb-3">
        {messages.length === 0 && (
          <p className="text-muted text-center">No messages yet. Start a conversation!</p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className="alert alert-primary p-2 mb-2">
            {msg}
          </div>
        ))}
      </div>

      <form
        className="input-group"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
