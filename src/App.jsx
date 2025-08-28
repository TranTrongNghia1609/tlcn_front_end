import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthModalProvider} from './context/AuthModalContext';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import Navbar from './components/layout/Navbar';
import AppRoutes from './routes/AppRoutes';
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
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
    </Router>
  );
}

export default App