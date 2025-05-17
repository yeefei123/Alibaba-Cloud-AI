import { jsPDF } from "jspdf";
import { marked } from "marked";
import React, { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppLayout from "../layout/AppLayout";

interface Message {
  sender: "user" | "bot";
  text: string;
  isHtml?: boolean;
  licenseScores?: LicenseScore[];
  showDashboard?: boolean; // NEW PROPERTY
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

interface LicenseScore {
  name: string;
  score: number;
  difficulty: "easy" | "medium" | "hard";
}

const stripHtmlTags = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const Chat: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "session-1",
      title: "Chat with Grantee",
      messages: [
        {
          sender: "bot",
          text: "🌸 Hi! I'm Grantee, your AI grant assistant. Tell me about your business!",
          isHtml: false,
        },
      ],
    },
  ]);
  const [selectedSessionId, setSelectedSessionId] = useState("session-1");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const chatRef = useRef<HTMLDivElement>(null);

  const Dashboard = () => {
    // Hardcoded data from your example
    const businessInfo = {
      company_name: "yoyo",
      malaysian_ownership_percent: 71,
      operational_duration_years: 2,
      annual_sales_turnover: 20000,
      sme_status_certification: true,
      business_sector: "food & beverage",
    };

    const licenses = [
      { name: "SSM Registration", cost: 60, processingTimeDays: 2 },
      { name: "Premises License (PBT)", cost: 1000, processingTimeDays: 28 },
      { name: "Food Handler Certificate", cost: 65, processingTimeDays: 1 },
      {
        name: "Typhoid Vaccination Certificate",
        cost: 60,
        processingTimeDays: 0,
      },
    ];

    const totalCost = licenses.reduce((sum, l) => sum + l.cost, 0);

    // For PieChart showing license cost distribution
    const pieData = licenses.map((l) => ({
      name: l.name,
      value: l.cost,
    }));

    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          📊 Business Dashboard for {businessInfo.company_name}
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Business Info</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              Malaysian Ownership: {businessInfo.malaysian_ownership_percent}%
            </li>
            <li>
              Operational Duration: {businessInfo.operational_duration_years}{" "}
              years
            </li>
            <li>
              Annual Sales Turnover: RM{" "}
              {businessInfo.annual_sales_turnover.toLocaleString()}
            </li>
            <li>
              SME Certification:{" "}
              {businessInfo.sme_status_certification ? "✅ Yes" : "❌ No"}
            </li>
            <li>Business Sector: {businessInfo.business_sector}</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-12">
          {/* Bar Chart for License Processing Time */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              License Processing Time (Days)
            </h3>
            <BarChart
              width={450}
              height={250}
              data={licenses}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="processingTimeDays" fill="#8884d8" />
            </BarChart>
          </div>

          {/* Pie Chart for License Cost Distribution */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              License Cost Distribution
            </h3>
            <PieChart width={300} height={250}>
              <Pie
                data={pieData}
                cx={150}
                cy={125}
                innerRadius={50}
                outerRadius={80}
                fill="#82ca9d"
                dataKey="value"
                label={(entry) => entry.name}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
            <p className="text-gray-700 mt-2 font-semibold">
              Total Cost: RM {totalCost}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  const selectedSession = chatSessions.find((s) => s.id === selectedSessionId);

  const parseLicenseScores = (text: string): LicenseScore[] => {
    try {
      const match = text.match(/```json([\s\S]*?)```/);
      if (match) {
        const parsed = JSON.parse(match[1].trim());
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) =>
              typeof item.name === "string" &&
              typeof item.score === "number" &&
              ["easy", "medium", "hard"].includes(item.difficulty)
          );
        }
      }
    } catch (err) {
      console.error("Failed to parse license scores:", err);
    }
    return [];
  };

  const summarizeScores = (messages: Message[]) => {
    const scores = messages.flatMap((msg) => msg.licenseScores ?? []);
    const difficultyCount: Record<string, number> = {
      easy: 0,
      medium: 0,
      hard: 0,
    };
    scores.forEach((s) => difficultyCount[s.difficulty]++);
    return {
      total: scores.length,
      difficultyData: Object.entries(difficultyCount).map(([key, value]) => ({
        name: key,
        value,
      })),
    };
  };

  const exportToPDF = (htmlText: string, index: number) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Business Plan Response from Grantee AI", 10, 10);
    doc.setFont("times", "normal");
    const plainText = stripHtmlTags(htmlText);
    const lines = doc.splitTextToSize(plainText, 180);
    doc.text(lines, 10, 20);
    doc.save(`grantee-business-plan-${index + 1}.pdf`);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedSession) return;

    const userMessage: Message = { sender: "user", text: input, isHtml: false };
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === selectedSessionId
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      )
    );
    setInput("");
    setLoading(true);

    const prompt = `Please respond in ${language}. User says: ${input}`;

    try {
      const response = await fetch("http://localhost:8000/api/qwen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      const licenseScores = parseLicenseScores(data.output?.text || "");

      const botReply: Message = {
        sender: "bot",
        text: data.output?.text ?? "⚠️ No response text available.",
        isHtml: true,
        licenseScores,
        showDashboard: data.output?.text?.includes("Step 1:"), // trigger dashboard rendering
      };

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
        isHtml: false,
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

  const { total, difficultyData } = summarizeScores(
    selectedSession?.messages || []
  );

  return (
    <AppLayout>
      {/* CHAT UI HEADER AND MESSAGES */}
      <div className="flex flex-col h-screen">
        <header className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 text-xl font-bold">
          Grantee AI Chatbot
        </header>
        <div className="flex flex-1">
          {/* Sidebar with Chat Sessions and Language Picker */}
          <aside className="w-64 p-4 bg-pink-50 border-r border-pink-200">
            <h2 className="font-semibold mb-2 font-black">Chat History</h2>
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`cursor-pointer p-2 rounded-lg ${
                  session.id === selectedSessionId
                    ? "bg-pink-300"
                    : "bg-pink-100"
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

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
            <div
              ref={chatRef}
              className="overflow-y-auto p-4 space-y-4 bg-white flex-grow"
              style={{ minHeight: 0, maxHeight: "calc(100vh - 130px)" }} // Add maxHeight to restrict height and enable scroll
            >
              {selectedSession?.messages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg shadow-md max-w-[70%] ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-black text-white"
                      }`}
                    >
                      {msg.isHtml && msg.sender === "bot" ? (
                        <div
                          className="prose max-w-full"
                          dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
                        />
                      ) : (
                        msg.text
                      )}
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
                  {msg.showDashboard && (
                    <div className="mt-4">
                      <Dashboard />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="text-gray-500 animate-pulse">🤖 Typing...</div>
              )}
            </div>

            <div className="p-4 bg-gray-100 flex items-center gap-2 border-t border-gray-300">
              <input
                className="flex-grow p-2 border border-gray-300 rounded"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleSend();
                  }
                }}
                disabled={loading}
                placeholder="Type your message..."
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-pink-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;
