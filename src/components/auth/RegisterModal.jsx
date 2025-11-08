import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';
import OTPVerificationModal from './OTPVerificationModal';
import { toast } from 'sonner';

const RegisterModal = () => {
  const { isRegisterOpen, closeModals, openLogin } = useAuthModal();
  const { register } = useAuth();
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registerUserName, setRegisteredUserName] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });

    if (id === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userName || !form.email || !form.password || !form.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin.');
      toast.error('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    setError('');

    const toastId = toast.loading('Đang đăng ký tài khoản...');

    try {
      const userData = {
        userName: form.userName.trim(),
        email: form.email,
        fullName: form.userName.trim(),
        password: form.password
      };

      console.log('Registering user:', userData);
      const response = await register(userData);
      console.log('Registration successful:', response);

      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.', {
        id: toastId,
        duration: 5000
      });

      setForm({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      closeModals();
      setRegisteredEmail(userData.email);
      setRegisteredUserName(userData.userName);
      setShowOTPModal(true);

    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Đăng ký không thành công. Vui lòng thử lại.';
      setError(errorMessage);
      toast.error(errorMessage, {
        id: toastId,
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerificationSuccess = (response) => {
    console.log('OTP verification completed:', response);
    
    toast.success('Xác thực tài khoản thành công! Vui lòng đăng nhập.', {
      duration: 4000
    });

    setShowOTPModal(false);
    setRegisteredEmail('');
    setRegisteredUserName('');
    
    setTimeout(() => {
      openLogin();
    }, 500);
  };

  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
    setRegisteredEmail('');
    setRegisteredUserName('');
    
    toast.info('Bạn có thể xác thực tài khoản sau. Vui lòng đăng nhập sau khi xác thực.', {
      duration: 4000
    });
  };

  const handleCloseRegisterModal = () => {
    closeModals();
    setForm({
      userName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={isRegisterOpen} onClose={handleCloseRegisterModal}>
        <div className="relative bg-white/80 backdrop-blur-md border border-white/30 shadow-xl rounded-xl sm:rounded-2xl w-full px-4 py-6 sm:px-6 md:px-8 sm:py-8 md:py-10 max-h-[90vh] overflow-y-auto">
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="flare-bg w-full h-full" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold gradient-text-dark text-center">
                Chào mừng đã đến với BNOJ
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 text-center px-2">
                Hãy tạo tài khoản của bạn
              </p>
            </div>

            {error && (
              <p className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4 text-center px-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              <div>
                <label htmlFor="userName" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  id="userName"
                  value={form.userName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="nguyenvana@gmail.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                  Nhập mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập mật khẩu"
                />
                {form.password && (
                  <div className="w-full mt-1 h-1.5 sm:h-2 rounded bg-gray-200 overflow-hidden transition-opacity duration-300">
                    <div
                      className={`h-full transition-all duration-500 ${
                        passwordStrength <= 2 ? 'bg-red-500 w-1/4' :
                        passwordStrength === 3 ? 'bg-yellow-400 w-2/4' :
                        passwordStrength === 4 ? 'bg-yellow-500 w-3/4' :
                        'bg-green-500 w-full'
                      }`}
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 sm:py-2.5 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng ký...
                  </div>
                ) : (
                  'Đăng Ký'
                )}
              </button>

              <p className="text-xs text-gray-500 flex items-center justify-center mt-3">
                — Hoặc đăng ký với —
              </p>

              <div className="flex flex-col gap-1.5 sm:gap-2 mt-2">
                <a
                  href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                  className="flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 sm:py-2.5 text-gray-700 hover:bg-gray-100 transition text-xs sm:text-sm"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Đăng ký với Google</span>
                  <span className="sm:hidden">Google</span>
                </a>

                <button
                  type="button"
                  className="flex items-center justify-center bg-gray-900 border border-gray-800 rounded-md py-2 sm:py-2.5 text-white hover:bg-gray-800 transition text-xs sm:text-sm cursor-pointer"
                  onClick={() => toast.info("GitHub Sign-In chưa được triển khai")}
                >
                  <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Đăng ký với GitHub</span>
                  <span className="sm:hidden">GitHub</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-center text-gray-700 mt-3 sm:mt-4">
                Bạn đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={openLogin}
                  className="underline text-purple-500 hover:text-pink-500 transition cursor-pointer"
                >
                  Đăng nhập
                </button>
              </p>
            </form>
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

      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={handleCloseOTPModal}
        email={registeredEmail}
        userName={registerUserName}
        onVerificationSuccess={handleOTPVerificationSuccess}
      />
    </>
  );
};

export default RegisterModal;