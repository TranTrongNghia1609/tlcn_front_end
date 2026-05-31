import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';
import UserMenu from './UserMenu';
import logo from '@/assets/logo.png';

const HeaderLandingPage = ({ sections = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { openLogin, openRegister } = useAuthModal();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-12 h-12 lg:w-13 lg:h-13 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <img src={logo}/>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                BN
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Online Judge</p>
            </div>
          </Link>

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
                <span 
                  className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-600 transition-all duration-300
                    ${activeSection === section.id ? 'w-3/4' : 'w-0 group-hover:w-1/2'}
                  `}
                />
                <span 
                  className={`
                    absolute inset-0 rounded-lg bg-blue-50 transition-opacity duration-300
                    ${activeSection === section.id ? 'opacity-100' : 'opacity-0 hover:opacity-50'}
                  `}
                  style={{ zIndex: -1 }}
                />
              </button>
            ))}
            
            {/* Kỳ thi */}
            <button
              onClick={() => navigate('/contests')}
              className="relative px-4 py-2 font-medium rounded-lg transition-all duration-300 cursor-pointer text-gray-600 hover:text-blue-600 flex items-center gap-1"
            >
              Kỳ thi
            </button>
          </nav>

          {/* Desktop Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              // Loading spinner while checking auth
              <div className="flex items-center">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : isAuthenticated ? (
              // Show User Menu when authenticated
              <UserMenu />
            ) : (
              // Show Auth Buttons when not authenticated
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
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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
              
              {/* Kỳ thi Mobile */}
              <button
                onClick={() => {
                  navigate('/contests');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:translate-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              >
                Kỳ thi
              </button>
              
              {/* Mobile Auth Section */}
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
                {loading ? (
                  // Loading state
                  <div className="flex items-center justify-center py-4">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : isAuthenticated ? (
                  // Show UserMenu component for mobile
                  <div className="block md:hidden">
                    <UserMenu isMobile onNavigate={() => setMobileMenuOpen(false)} />
                  </div>
                ) : (
                  // Show Auth Buttons when not authenticated
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        openLogin();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full transform transition-all duration-300 hover:scale-105"
                    >
                      Đăng nhập
                    </Button>
                    <Button 
                      onClick={() => {
                        openRegister();
                        setMobileMenuOpen(false);
                      }}
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