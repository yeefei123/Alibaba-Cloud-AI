import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  FileText,
  HelpCircle,
  Home,
  MessageSquare,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  sidebarOpen: boolean;
  activeNav: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, activeNav }) => {
  const navigate = useNavigate();

  const nav = [
    { label: "Home", icon: <Home className="h-5 w-5" />, path: "/" },
    {
      label: "Eligible Grants",
      icon: <CheckCircle className="h-5 w-5" />,
      path: "/grants",
    },
    {
      label: "Applications",
      icon: <FileText className="h-5 w-5" />,
      path: "/applications",
    },
    {
      label: "Regulations",
      icon: <BookOpen className="h-5 w-5" />,
      path: "/regulations",
    },
    {
      label: "Support",
      icon: <HelpCircle className="h-5 w-5" />,
      path: "/support",
    },
    {
      label: "Chat Assistant",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/chat",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 shadow-lg z-20 flex flex-col transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center px-8 border-b bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
            <span className="text-blue-600 font-bold text-xl">AI</span>
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">
            Grant Navigator
          </h1>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto min-h-0 py-8 px-4">
        <div className="space-y-2">
          {nav.map(({ label, icon, path }) => (
            <button
              key={label}
              onClick={() => handleNavigation(path)}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition-all w-full group
                ${
                  label === activeNav
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span
                className={`${
                  label === activeNav
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                {icon}
              </span>
              <span className="flex-1 text-left">{label}</span>
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 ${
                  label === activeNav
                    ? "text-blue-600 rotate-90"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
            </button>
          ))}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="p-6 border-t bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-semibold">SME</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              My SME Account
            </p>
            <p className="text-xs text-gray-500 truncate">View Profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
