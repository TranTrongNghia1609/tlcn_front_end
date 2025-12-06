import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';
import OTPVerificationModal from './OTPVerificationModal';
import { toast } from 'sonner';

const RegisterModal = () => {
  const { isRegisterOpen, closeModals, switchToLogin, modalOptions } = useAuthModal();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // ===== Prefill email khi modal mở =====
  useEffect(() => {
    if (isRegisterOpen && modalOptions?.prefillEmail) {

      const emailPrefix = modalOptions.prefillEmail.split('@')[0];

      setForm(prev => ({
        ...prev,
        email: modalOptions.prefillEmail,
        userName: emailPrefix // Suggest username từ email
      }));
    } else if (!isRegisterOpen) {
      // Reset form khi đóng modal
      setForm({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setError('');
      setPasswordStrength(0);
    }
  }, [isRegisterOpen, modalOptions?.prefillEmail]);

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

      const response = await register(userData);

      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.', {
        id: toastId,
        duration: 5000
      });

      // ===== Gọi onSuccess callback nếu có =====
      if (modalOptions?.onSuccess && typeof modalOptions.onSuccess === 'function') {
        modalOptions.onSuccess(response);
      }

      // Reset form
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

    toast.success('Xác thực tài khoản thành công! Vui lòng đăng nhập.', {
      duration: 4000
    });

    setShowOTPModal(false);
    setRegisteredEmail('');
    setRegisteredUserName('');

    setTimeout(() => {
      switchToLogin();
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

              {/* ===== Hiển thị email được mời nếu có ===== */}
              {modalOptions?.prefillEmail && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 mt-2 w-full">
                  <p className="text-sm text-green-800 text-center">
                    📧 Đăng ký bằng email: <strong>{modalOptions.prefillEmail}</strong>
                  </p>
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4 text-center px-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              {/* Username field */}
              <div>
                <label htmlFor="userName" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="userName"
                  value={form.userName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="username"
                />
              </div>

              {/* Email field - ===== DISABLED NẾU CÓ PREFILL ===== */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                  Email <span className="text-red-500">*</span>
                  {modalOptions?.prefillEmail && (
                    <span className="text-xs text-gray-500 ml-2">(Email từ lời mời)</span>
                  )}
                </label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={!!modalOptions?.prefillEmail || loading} // ===== DISABLE NẾU CÓ PREFILL =====
                  className="w-full px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="nguyenvana@gmail.com"
                />
                {modalOptions?.prefillEmail && (
                  <p className="text-xs text-gray-500 mt-1">
                    ℹ️ Email này được mời tham gia lớp học
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="relative">
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                  Nhập mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed pr-10 sm:pr-12"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute top-8 sm:top-9 right-2 sm:right-3 p-1 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
                {form.password && (
                  <div className="w-full mt-1 h-1.5 sm:h-2 rounded bg-gray-200 overflow-hidden transition-opacity duration-300">
                    <div
                      className={`h-full transition-all duration-500 ${passwordStrength <= 2 ? 'bg-red-500 w-1/4' :
                          passwordStrength === 3 ? 'bg-yellow-400 w-2/4' :
                            passwordStrength === 4 ? 'bg-yellow-500 w-3/4' :
                              'bg-green-500 w-full'
                        }`}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Tối thiểu 6 ký tự
                </p>
              </div>

              {/* Confirm Password field */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1 sm:mb-2">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed pr-10 sm:pr-12"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  className="absolute top-8 sm:top-9 right-2 sm:right-3 p-1 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 sm:py-2.5 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
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

              {/* Divider */}
              <p className="text-xs text-gray-500 flex items-center justify-center mt-3">
                — Hoặc đăng ký với —
              </p>

              {/* Social buttons */}
              <div className="flex flex-col gap-1.5 sm:gap-2 mt-2">
                <a
                  href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                  className="flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 sm:py-2.5 text-gray-700 hover:bg-gray-100 transition text-xs sm:text-sm"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Đăng ký với Google</span>
                  <span className="sm:hidden">Google</span>
                </a>


              </div>

              {/* Already have account */}
              <p className="text-xs sm:text-sm text-center text-gray-700 mt-3 sm:mt-4">
                Bạn đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={switchToLogin}
                  disabled={loading}
                  className="underline text-purple-500 hover:text-pink-500 transition cursor-pointer disabled:opacity-50"
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