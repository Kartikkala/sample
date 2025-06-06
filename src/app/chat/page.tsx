// app/chat/page.tsx
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
    <>
      <div className="mb-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="alert alert-primary p-2 mb-2">{msg}</div>
        ))}
      </div>
      <div className="input-group">
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={sendMessage} className="btn btn-primary">Send</button>
      </div>
    </>
  );
}
