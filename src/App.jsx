import { useState } from 'react'
import { BrowserRouter, BrowserRouter as Router, useLocation } from 'react-router-dom';

import { AuthModalProvider } from '@/context/AuthModalContext';
import { UserProvider } from '@/context/UserContext';
import { ClassroomProvider } from '@/context/ClassroomContext';
import { MaterialProvider } from '@/context/MaterialContext';
import { ProblemProvider } from '@/context/ProblemContext';
import { StudentClassroomProvider } from '@/context/StudentClassroomContext';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import Navbar from '@/components/layout/NavBar';
import { PostProvider } from '@/context/PostContext';
import AppRoutes from '@/routes/AppRoutes';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { CommentProvider } from '@/context/CommentContext';
import { SocketProvider } from '@/context/SocketContext';
import { Toaster } from 'sonner';
import ForgotPasswordModal from './components/auth/ForgotPasswordModal';
import Footer from './components/layout/Footer';
import '@/index.css'

const AppContent = () => {
  const { loading } = useAuth();
  const location = useLocation();
  
  // Check if current route is landing page or workspace/problem page
  const isLandingPage = location.pathname === '/';
  const isWorkspacePage = location.pathname.includes('/problem/') || 
                          location.pathname.includes('/contest/') ||
                          location.pathname.includes('/classrooms/');

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SocketProvider url={import.meta.env.VITE_SOCKET_URL}>
      <UserProvider>
        <ClassroomProvider>
          <MaterialProvider>
            <ProblemProvider>
              <StudentClassroomProvider>
                <PostProvider>
                  <CommentProvider>
                    <AuthModalProvider>
                      <div className="min-h-screen bg-gray-50 flex flex-col">
                        {/* Only show Navbar if NOT on landing page */}
                        {!isLandingPage && <Navbar />}
                        
                        <main className={`flex-1 ${!isLandingPage ? "pt-16 lg:pt-20" : ""}`}>
                          <AppRoutes />
                        </main>
                        
                        {/* Only show Footer if NOT on workspace/problem page */}
                        {!isWorkspacePage && <Footer />}

                        {/* Auth Modals */}
                        <LoginModal />
                        <RegisterModal />
                        <ForgotPasswordModal />
                        
                        {/* Toast Notifications */}
                        <Toaster
                          position="top-right"
                          richColors
                          closeButton
                          duration={3000}
                          expand={false}
                          toastOptions={{
                            style: {
                              background: '#fff',
                              color: '#333',
                            },
                            className: 'toast-notification',
                          }}
                        />
                      </div>
                    </AuthModalProvider>
                  </CommentProvider>
                </PostProvider>
              </StudentClassroomProvider>
            </ProblemProvider>
          </MaterialProvider>
        </ClassroomProvider>
      </UserProvider>
    </SocketProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent /> 
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App