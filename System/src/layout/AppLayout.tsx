import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import MainContent from "./MainContent";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const location = useLocation();

  // Check if we're in mobile view on mount and resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  // Close sidebar if resizing from mobile to desktop while open
  useEffect(() => {
    if (!isMobileView && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobileView, sidebarOpen]);

  // Get current active navigation item based on path
  const getActiveNav = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path.startsWith("/grants")) return "Eligible Grants";
    if (path.startsWith("/applications")) return "Applications";
    if (path.startsWith("/regulations")) return "Regulations";
    if (path.startsWith("/support")) return "Support";
    if (path.startsWith("/chat")) return "Chat Assistant";
    return "Home";
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Backdrop */}
      {isMobileView && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      {/* <Sidebar sidebarOpen={sidebarOpen} activeNav={getActiveNav()} /> */}

      {/* Main Content Area */}
      <div>
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="h-full">
          <div>
            <MainContent>{children}</MainContent>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
