import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useUser } from '../context/UserContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useUser();
  
  // Don't show navbar on tracking page for cleaner UI
  const isTrackingPage = location.pathname.includes('/ride/');
  
  // Check if this is the home page
  const isHomePage = location.pathname === '/';
  
  // Determine if the footer should be shown
  const showFooter = !isTrackingPage;
  
  // Determine if we're on a page that should have padding
  const needsPadding = !isHomePage && !isTrackingPage;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isTrackingPage && <Navbar />}
      
      <main className={`flex-grow ${needsPadding ? 'pt-16 px-4 md:px-8 lg:px-16' : ''}`}>
        <Outlet />
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;