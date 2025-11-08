import { useState } from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import { AuthModalProvider } from '@/context/AuthModalContext';
import { UserProvider } from '@/context/UserContext';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import Navbar from '@/components/layout/NavBar';
import { PostProvider } from '@/context/PostContext';
import AppRoutes from '@/routes/AppRoutes';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { CommentProvider } from '@/context/CommentContext';
import '@/index.css'
import { SocketProvider } from '@/context/SocketContext';

const AppContent = () => {
  const { loading } = useAuth();
  const location = useLocation();
  
  // Check if current route is landing page
  const isLandingPage = location.pathname === '/';

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SocketProvider url={import.meta.env.VITE_SOCKET_URL}>
      <UserProvider>
        <PostProvider>
          <CommentProvider>
            <AuthModalProvider>
              <div className="min-h-screen bg-gray-50">
                {/* Only show Navbar if NOT on landing page */}
                {!isLandingPage && <Navbar />}
                
                <main className={!isLandingPage ? "pt-16 lg:pt-20" : ""}>
                  <AppRoutes />
                </main>
                <LoginModal />
                <RegisterModal />
              </div>
            </AuthModalProvider>
          </CommentProvider>
        </PostProvider>
      </UserProvider>
    </SocketProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent /> 
      </AuthProvider>
    </Router>
  );
}

export default App