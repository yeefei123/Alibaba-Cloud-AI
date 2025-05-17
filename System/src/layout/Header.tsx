import { Bell, ChevronDown, Globe, Menu } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <header
      className={`top-0 right-0 left-0 sm:left-72 h-20 border-b border-gray-200 bg-white shadow-sm z-30 transition-all duration-300 ${className}`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors duration-200 sm:hidden"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Dashboard & Chatbot navigation buttons */}
          <nav className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-white-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="text-white-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Chatbot
            </button>
          </nav>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            <Globe className="h-4 w-4" />
            <select className="bg-transparent focus:outline-none cursor-pointer">
              <option value="en">English</option>
              <option value="ms">Malay</option>
            </select>
          </div>
        </div>

        {/* Center section - Search */}
        {/* <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grants, regulations, or help topics..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-200"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </form> */}

        {/* Right section */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors duration-200 relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-semibold">SME</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                My SME Account
              </p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
