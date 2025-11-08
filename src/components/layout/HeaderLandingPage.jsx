import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HeaderLandingPage = ({ sections = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { openLogin, openRegister } = useAuthModal();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // offset for header height

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // offset for sticky header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110 cursor-pointer">
              <span className="text-white font-bold text-xl">BN</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                BNOJ
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`
                  relative px-4 py-2 font-medium rounded-lg transition-all duration-300 cursor-pointer
                  ${activeSection === section.id 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                  }
                `}
              >
                {section.label}
                {/* Active indicator */}
                <span 
                  className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-600 transition-all duration-300
                    ${activeSection === section.id ? 'w-3/4' : 'w-0 group-hover:w-1/2'}
                  `}
                />
                {/* Hover background */}
                <span 
                  className={`
                    absolute inset-0 rounded-lg bg-blue-50 transition-opacity duration-300
                    ${activeSection === section.id ? 'opacity-100' : 'opacity-0 hover:opacity-50'}
                  `}
                  style={{ zIndex: -1 }}
                />
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 animate-fadeIn">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.userName || user?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role || 'User'}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center transform transition-transform hover:scale-110">
                    <span className="text-white font-medium text-sm">
                      {(user?.userName || user?.email)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={openLogin}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                >
                  Đăng nhập
                </Button>
                <Button
                  onClick={openRegister}
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Đăng ký
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    text-left px-4 py-3 rounded-lg font-medium transition-all duration-300
                    transform hover:translate-x-2
                    ${activeSection === section.id 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: mobileMenuOpen ? 'slideInLeft 0.3s ease-out forwards' : 'none'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{section.label}</span>
                    {activeSection === section.id && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    )}
                  </div>
                </button>
              ))}
              
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-2 animate-fadeIn">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {(user?.userName || user?.email)?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.userName || user?.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.role || 'User'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate('/dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full transform transition-all duration-300 hover:scale-105"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-red-600 hover:text-red-700 transform transition-all duration-300 hover:scale-105"
                    >
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={openLogin}
                      className="w-full transform transition-all duration-300 hover:scale-105"
                    >
                      Đăng nhập
                    </Button>
                    <Button 
                      onClick={openRegister} 
                      className="w-full bg-blue-600 hover:bg-blue-700 transform transition-all duration-300 hover:scale-105"
                    >
                      Đăng ký
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </header>
  );
};

export default HeaderLandingPage;