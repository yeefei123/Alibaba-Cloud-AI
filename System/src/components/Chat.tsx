import { jsPDF } from "jspdf";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

const Chat: React.FC = () => {
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
  const exportToPDF = (text: string, index: number) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Business Plan Response from Grantee AI", 10, 10);
    doc.setFont("times", "normal");
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 20);
    doc.save(`grantee-business-plan-${index + 1}.pdf`);
  };

  const selectedSession = chatSessions.find((s) => s.id === selectedSessionId);

  const handleSend = async () => {
    if (!input.trim() || !selectedSession) return;

    const userMessage: Message = { sender: "user", text: input };
    const updatedSessions = chatSessions.map((session) =>
      session.id === selectedSessionId
        ? { ...session, messages: [...session.messages, userMessage] }
        : session
    );

    setChatSessions(updatedSessions);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/qwen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      const botReply: Message = { sender: "bot", text: `✨ ${data.reply}` };

      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === selectedSessionId
            ? { ...session, messages: [...session.messages, botReply] }
            : session
        )
      );
    } catch {
      const errorReply: Message = {
        sender: "bot",
        text: "⚠️ Oops! Something went wrong.",
      };
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
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatSessions]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 to-pink-200 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-5 flex items-center shadow-lg">
        <div className="text-3xl mr-4">🤖</div>
        <h1 className="text-2xl font-semibold tracking-wide">
          Grantee AI Chatbot
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden bg-white w-full border-t border-pink-200">
        {/* Sidebar */}
        <aside className="w-64 bg-pink-50 border-r border-pink-200 p-6 flex flex-col">
          <h2 className="text-pink-600 font-semibold mb-4 text-lg">
            Chat History
          </h2>
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
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-end">
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

                {/* Export Button under bot messages */}
                {msg.sender === "bot" && (
                  <button
                    onClick={() => exportToPDF(msg.text, idx)}
                    className="ml-14 mt-2 text-xs text-pink-600 hover:underline"
                  >
                    📄 Export to PDF
                  </button>
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

          {/* Upload File Button */}
          <div className="px-5 pb-3 bg-white">
            <label className="flex bg-gray-800 hover:bg-gray-700 text-white text-base font-medium px-4 py-2.5 outline-none rounded w-max cursor-pointer mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 mr-2 fill-white inline"
                viewBox="0 0 32 32"
              >
                <path
                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                  data-original="#000000"
                />
                <path
                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                  data-original="#000000"
                />
              </svg>
              Upload
              <input type="file" id="uploadFile1" className="hidden" />
            </label>
          </div>

          {/* Input Bar */}
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
};

export default Chat;
