import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

const MainContent: React.FC<MainContentProps> = ({ children, className = '' }) => {
  return (
    <main
      className={`
        flex-1 min-h-[calc(100vh-5rem)] 
        p-4 sm:p-8 
        max-w-6xl mx-auto 
        ${className}
      `}
    >
      {children}
    </main>
  );
};

export default MainContent; 