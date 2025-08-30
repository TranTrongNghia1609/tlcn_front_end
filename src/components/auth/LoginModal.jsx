import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';
const LoginModal = () => {
  const { isLoginOpen, closeModals, switchToRegister } = useAuthModal();
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const credentials = {
        userName: username.trim(),
        password: password
      }
      const response = await login(credentials);
      console.log('Login successful: ', response);
      closeModals();
      setUsername('');
      setPassword('');
      setError('');
    } catch (error) {
      console.error('Login error', error);
      setError(error.message || 'Đăng nhập không thành công')
    } finally {
      setLoading(false);
    }
    const handleClose = () => {
      closeModals();
      setUsername('');
      setPassword('');
      setError('');
      setLoading(false);
    };
  };

  return (
    <Modal isOpen={isLoginOpen} onClose={closeModals}>
      <div className="relative bg-white/80 backdrop-blur-md border border-white/30 shadow-xl rounded-xl sm:rounded-2xl w-full px-4 py-6 sm:px-6 md:px-8 sm:py-8 md:py-10 max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="flare-bg w-full h-full" />
        </div>

        <div className="relative z-10">
          {/* Header - responsive text sizes */}
          <div className="flex flex-col items-center space-y-1 sm:space-y-2 mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold gradient-text-dark">Welcome</h2>
            <p className="text-xs sm:text-sm text-gray-600 text-center px-2">
              Your account is protected with secure authentication.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4 text-center px-2">
              {error}
            </p>
          )}

          {/* Form with responsive spacing */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
            {/* Email field */}
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 sm:pr-12"
                placeholder="●●●●●"
              />
              <div
                className="absolute top-8 sm:top-9 right-2 sm:right-3 cursor-pointer p-1"
                onClick={() => !loading && setShowPassword(!showPassword)}
                tabIndex={0}
                aria-label="Hiện/Ẩn mật khẩu"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-4.03 9-9 9S3 17 3 12 7.03 3 12 3s9 4.03 9 9z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9-4.03-9-9a8.96 8.96 0 012.125-5.825M6.6 6.6l10.8 10.8M9.88 9.88a3 3 0 004.24 4.24" />
                  </svg>
                )}
              </div>
            </div>

            {/* Submit button - responsive padding */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 sm:py-3 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng nhập...
                </div>
              ) : (
                'Login'
              )}
            </button>

            {/* Forgot/Signup links - responsive layout */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-2 text-xs sm:text-sm">
              <button
                type="button"
                className="text-purple-600 hover:underline"
                disabled={loading}
              >
                Forgot Password?
              </button>
              <button
                type="button"
                onClick={switchToRegister}
                className="text-pink-600 hover:underline"
                disabled={loading}
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* Social Sign-In - responsive spacing and sizing */}
          <div className="mt-4 sm:mt-6 text-center space-y-2 sm:space-y-3">
            <p className="text-xs text-gray-500">— or sign in with —</p>

            {/* Social buttons - responsive layout */}
            <div className="space-y-2 sm:space-y-3">
              {/* Google */}
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 sm:py-2.5 rounded-md font-medium border border-gray-200 shadow-sm hover:scale-[1.02] transition text-xs sm:text-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Google</span>
              </a>

              {/* GitHub */}
              <button
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2 sm:py-2.5 rounded-md font-medium border border-gray-800 shadow-sm hover:scale-[1.02] transition text-xs sm:text-sm"
                onClick={() => alert("GitHub Sign-In not implemented")}
                disabled={loading}
              >
                <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Sign in with GitHub</span>
                <span className="sm:hidden">GitHub</span>
              </button>
            </div>
          </div>
        </div>

        <style>
          {`
            .gradient-text-dark {
              background: linear-gradient(90deg, #7286ff, #fe7587);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .flare-bg {
              background: radial-gradient(40% 40% at 50% 50%, rgba(210,32,255,0.4) 0%, rgba(210,32,255,0.1) 40%, transparent 80%);
              filter: blur(100px);
            }
          `}
        </style>
      </div>
    </Modal>
  );
};

export default LoginModal;