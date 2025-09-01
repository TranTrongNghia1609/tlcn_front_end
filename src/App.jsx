import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthModalProvider } from './context/AuthModalContext';
import { UserProvider } from './context/UserContext';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import Navbar from './components/layout/Navbar';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import './index.css'


// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <Router>
//       <AuthProvider>
//         <UserProvider>
//         <AuthModalProvider>
//           <div className="min-h-screen bg-gray-50">
//             <Navbar />
//             <main className="pt-16 lg:pt-20">
//               <AppRoutes />
//             </main>
//             {/* Modal Components - Luôn có sẵn để mở từ bất kỳ đâu */}
//             <LoginModal />
//             <RegisterModal />
//           </div>
//         </AuthModalProvider>
//         </UserProvider>
//       </AuthProvider>

//     </Router>
//   );
// }
const AppContent = () => {
  const { loading } = useAuth();

  // ✅ Show loading spinner khi đang check auth
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
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
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent /> {/* ✅ Wrap content trong AppContent */}
      </AuthProvider>
    </Router>
  );
}

export default App