import React from 'react';
import Sidebar from './Sidebar';
import FloatingChatbot from './FloatingChatbot';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Sidebar />
      <div className="ml-80 transition-all duration-300">
        <Header />
        <main className="min-h-screen p-8">
          {children}
        </main>
      </div>
      <FloatingChatbot />
    </div>
  );
};

export default Layout;