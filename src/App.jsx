import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthModalProvider } from './context/AuthModalContext';
import { UserProvider } from './context/UserContext';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import Navbar from './components/layout/Navbar';
import AppRoutes from './routes/AppRoutes';
import './index.css'
import { AuthProvider } from './context/AuthContext';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
        <AuthModalProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16 lg:pt-20">
              <AppRoutes />
            </main>
            {/* Modal Components - Luôn có sẵn để mở từ bất kỳ đâu */}
            <LoginModal />
            <RegisterModal />
          </div>
        </AuthModalProvider>
        </UserProvider>
      </AuthProvider>

    </Router>
  );
}

export default App