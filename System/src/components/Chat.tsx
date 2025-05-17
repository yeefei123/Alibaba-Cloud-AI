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
  const [language, setLanguage] = useState("English");
  const chatRef = useRef<HTMLDivElement>(null);

  const selectedSession = chatSessions.find((s) => s.id === selectedSessionId);

  const exportToPDF = (text: string, index: number) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Business Plan Response from Grantee AI", 10, 10);
    doc.setFont("times", "normal");
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 20);
    doc.save(`grantee-business-plan-${index + 1}.pdf`);
  };

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

    const prompt = `Please respond in ${language}. User says: ${input}`;

    try {
      const res = await fetch("http://localhost:8080/api/qwen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
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
    <div className="flex flex-col h-screen w-screen">
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 text-xl font-bold">
        Grantee AI Chatbot
      </header>

      <div className="flex flex-1">
        <aside className="w-64 p-4 bg-pink-50 border-r border-pink-200">
          <h2 className="font-semibold mb-2 font-black">Chat History</h2>
          {chatSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSessionId(session.id)}
              className={`cursor-pointer p-2 rounded-lg ${
                session.id === selectedSessionId ? "bg-pink-300" : "bg-pink-100"
              }`}
            >
              {session.title}
            </div>
          ))}

          <div className="mt-6">
            <label className="block mb-1 text-sm font-medium text-pink-800">
              Select Language
            </label>
            <select
              className="w-full p-2 rounded border"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Malay</option>
              <option>Chinese</option>
              <option>Arabic</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-white"
          >
            {selectedSession?.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg shadow-md ${
                    msg.sender === "user" ? "bg-blue-100" : "bg-black"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "bot" && (
                  <button
                    onClick={() => exportToPDF(msg.text, idx)}
                    className="ml-2 text-xs text-pink-600 hover:underline"
                  >
                    📄 Export
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 animate-pulse">🤖 Typing...</div>
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

          <div className="p-4 border-t flex gap-2">
            <input
              className="flex-1 p-2 border rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message here..."
            />
            <button
              onClick={handleSend}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
