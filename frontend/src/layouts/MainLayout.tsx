import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Scroll-aware Navigation */}
      <Navbar />
      
      {/* Main page viewports */}
      <main className="flex-grow pt-20">
        {children}
      </main>
      
      {/* Brand Footer */}
      <Footer />
    </div>
  );
};
export default MainLayout;
