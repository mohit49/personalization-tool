'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  let socket;

  useEffect(() => {
    socket = io({
      path: '/api/socket',
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', input);
      setInput('');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Chat App</h1>
      <div className="mt-4">
        {messages.map((msg, i) => (
          <p key={i} className="bg-gray-200 p-2 my-1 rounded">
            {msg}
          </p>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
