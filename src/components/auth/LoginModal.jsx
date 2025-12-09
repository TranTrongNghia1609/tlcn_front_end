import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';
import classroomService from '@/services/classroomService';
import { toast } from 'sonner';

const LoginModal = () => {
  const { isLoginOpen, closeModals, switchToRegister, switchToForgotPassword, modalOptions } = useAuthModal();
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
  }, [isLoginOpen, modalOptions.prefillEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ username và mật khẩu.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const credentials = {
        userName: username.trim(),
        password: password
      };
      const response = await login(credentials);
      
      setUsername('');
      setPassword('');
      setError('');

      if (modalOptions.pendingAction) {
        const { type, data } = modalOptions.pendingAction;
        
        if (type === 'joinClassroom') {
          const { classCode, token } = data;
          closeModals();
          const toastId = toast.loading('Đang tham gia lớp học...');
          
          try {
            await classroomService.joinClassroomByToken(classCode, token);
            toast.success('Tham gia lớp học thành công!', { id: toastId, duration: 3000 });
            setTimeout(() => { navigate(`/classrooms/${classCode}`); }, 1000);
          } catch (error) {
            console.error('Error joining classroom:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi tham gia lớp học', { id: toastId, duration: 4000 });
          }
          return;
        }
      }

      if (modalOptions.onSuccess && typeof modalOptions.onSuccess === 'function') {
        modalOptions.onSuccess(response);
      }

      closeModals();

      if (!modalOptions.onSuccess && !modalOptions.pendingAction) {
        navigate('/home');
      }
     
    } catch (error) {
      console.error('Login error', error);
      setError(error.message || 'Đăng nhập không thành công');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    closeModals();
    setUsername('');
    setPassword('');
    setError('');
    setLoading(false);
  };

  return (
    <Modal isOpen={isLoginOpen} onClose={handleClose}>
      <div className="relative bg-white/80 backdrop-blur-md border border-white/30 shadow-xl rounded-xl sm:rounded-2xl w-full px-4 py-6 sm:px-6 md:px-8 sm:py-8 md:py-10 max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="flare-bg-blue w-full h-full" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center space-y-1 sm:space-y-2 mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold gradient-text-blue">Chào mừng</h2>
            <p className="text-xs sm:text-sm text-gray-600 text-center px-2">
              Tài khoản của bạn được bảo vệ bằng xác thực an toàn.
            </p>
            
            
            
            {modalOptions.pendingAction?.type === 'joinClassroom' && (
              <div className="bg-green-50 border border-green-400 rounded-lg px-4 py-2 mt-2">
                <p className="text-sm text-green-800 font-medium">
                  🎓 Sau khi đăng nhập, bạn sẽ tự động tham gia lớp học
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4 text-center px-2 font-medium">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-gray-700 text-left mb-1 sm:mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Tên đăng nhập"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 text-left mb-1 sm:mb-2">
                Mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 pr-10 sm:pr-12"
                placeholder="●●●●●"
              />
              <button
                type="button"
                className="absolute top-8 sm:top-9 right-2 sm:right-3 p-1 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-2.5 sm:py-3 rounded-md font-bold text-white hover:shadow-xl hover:from-blue-700 hover:to-blue-900 hover:scale-[1.02] transition text-sm sm:text-base disabled:opacity-50 cursor-pointer"
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

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-2 text-xs sm:text-sm">
              <button
                type="button"
                onClick={switchToForgotPassword}
                className="text-blue-700 font-semibold hover:text-blue-900 hover:underline cursor-pointer"
                disabled={loading}
              >
                Quên mật khẩu?
              </button>
              <button
                type="button"
                onClick={switchToRegister}
                className="text-blue-700 font-semibold hover:text-blue-900 hover:underline cursor-pointer"
                disabled={loading}
              >
                Đăng ký
              </button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6 text-center space-y-2 sm:space-y-3">
            <p className="text-xs text-gray-500 font-medium">— hoặc đăng nhập với —</p>

            <div className="space-y-2 sm:space-y-3">
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 sm:py-2.5 rounded-md font-semibold border-2 border-gray-300 shadow-sm hover:border-blue-600 hover:shadow-md transition text-xs sm:text-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Đăng nhập với Google</span>
                <span className="sm:hidden">Google</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;