import React, { useState, useRef, useEffect } from "react";
import './App.css'

function App() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "session-1",
      title: "Chat with Grantee",
      messages: [
        {
          sender: "bot",
          text: "🌸 Hi! I'm Grantee, your AI grant assistant. Tell me about your business!",
        },
      ],
    },
  ]);
  const [selectedSessionId, setSelectedSessionId] = useState("session-1");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const selectedSession = chatSessions.find((s) => s.id === selectedSessionId);

  const handleSend = async () => {
    if (!input.trim() || !selectedSession) return;

    const userMessage = { sender: "user", text: input };
    const updatedSessions = chatSessions.map((session) =>
      session.id === selectedSessionId
        ? { ...session, messages: [...session.messages, userMessage] }
        : session
    );

    setChatSessions(updatedSessions);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      const botReply = { sender: "bot", text: `✨ ${data.reply}` };

      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === selectedSessionId
            ? { ...session, messages: [...session.messages, botReply] }
            : session
        )
      );
    } catch {
      const errorReply = { sender: "bot", text: "⚠️ Oops! Something went wrong." };
      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === selectedSessionId
            ? { ...session, messages: [...session.messages, errorReply] }
            : session
        )
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [chatSessions]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 to-pink-200 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-5 flex items-center shadow-lg">
        <div className="text-3xl mr-4">🤖</div>
        <h1 className="text-2xl font-semibold tracking-wide">Grantee AI Chatbot</h1>
      </header>

      <div className="flex flex-1 overflow-hidden bg-white w-full border-t border-pink-200">
        {/* Sidebar */}
        <aside className="w-64 bg-pink-50 border-r border-pink-200 p-6 flex flex-col">
          <h2 className="text-pink-600 font-semibold mb-4 text-lg">Chat History</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`p-3 rounded-lg cursor-pointer text-sm truncate ${
                  selectedSessionId === session.id
                    ? "bg-pink-200 text-pink-900 font-semibold"
                    : "bg-pink-100 text-pink-800"
                }`}
              >
                {session.title}
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Panel */}
        <main className="flex-1 flex flex-col justify-between">
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto px-8 py-6 space-y-5 bg-white"
          >
            {selectedSession?.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="mr-3 w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-6 py-3 rounded-2xl text-sm shadow-md ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-blue-900 rounded-br-none text-right"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="ml-3 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    🧑
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-full flex items-center justify-center shadow-lg">
                  🤖
                </div>
                <div className="flex items-center gap-1 animate-pulse px-5 py-2 rounded-2xl bg-gray-200 text-gray-600 shadow">
                  <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                  <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                  <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-5 bg-white flex justify-center">
            <div className="w-4/5 flex gap-3">
              <input
                type="text"
                className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                placeholder="Type your question about AI grants..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full text-sm shadow-lg transition"
              >
                ➤
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;