import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { toast } from 'sonner';

const ForgotPasswordModal = () => {
  const { 
    sendForgotPasswordOTP, 
    verifyForgotPasswordOTP, 
    resetPassword,
    resendForgotPasswordOTP,
    pendingPasswordReset 
  } = useAuth();
  
  const { isForgotPasswordOpen, closeModals, switchToLogin } = useAuthModal();

  // Step states
  const [step, setStep] = useState(1); // 1: Enter Username, 2: Verify OTP, 3: Reset Password
  const [userName, setUserName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Refs for OTP inputs
  const inputRefs = useRef([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset form khi modal đóng
  useEffect(() => {
    if (!isForgotPasswordOpen) {
      resetForm();
    }
  }, [isForgotPasswordOpen]);

  // Auto focus first OTP input when step 2
  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  const resetForm = () => {
    setStep(1);
    setUserName('');
    setOtp(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
    setCountdown(0);
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = digits[i] || '';
        }
        setOtp(newOtp);
        
        // Focus last filled input or first empty
        const lastIndex = Math.min(digits.length, 5);
        inputRefs.current[lastIndex]?.focus();
      });
    }
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Vui lòng nhập username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await sendForgotPasswordOTP(userName.trim());
      toast.success(response.message || 'Mã OTP đã được gửi đến email của bạn');
      setStep(2);
      setCountdown(60); // Start 60s countdown
    } catch (error) {
      setError(error.message || 'Gửi OTP thất bại');
      toast.error(error.message || 'Gửi OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số OTP');
      toast.error('Vui lòng nhập đầy đủ 6 chữ số OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyForgotPasswordOTP(otpCode);
      toast.success(response.message || 'Xác thực OTP thành công');
      setStep(3);
    } catch (error) {
      setError(error.message || 'Mã OTP không chính xác');
      toast.error(error.message || 'Mã OTP không chính xác');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await resetPassword(newPassword);
      toast.success(response.message || 'Đặt lại mật khẩu thành công');
      
      // Chuyển về trang đăng nhập sau 1.5s
      setTimeout(() => {
        closeModals();
        switchToLogin();
      }, 1500);
      
    } catch (error) {
      setError(error.message || 'Đặt lại mật khẩu thất bại');
      toast.error(error.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError('');

    try {
      const response = await resendForgotPasswordOTP();
      toast.success(response.message || 'Mã OTP mới đã được gửi');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']); // Clear OTP input
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.message || 'Gửi lại OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    closeModals();
    resetForm();
  };

  return (
    <Modal isOpen={isForgotPasswordOpen} onClose={handleClose} size="md">
      <div className="relative bg-white/80 backdrop-blur-md border border-white/30 shadow-xl rounded-xl w-full px-6 py-8 max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="flare-bg-blue w-full h-full" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2 mb-6">
            <h2 className="text-3xl font-extrabold gradient-text-blue">
              {step === 1 && 'Quên mật khẩu'}
              {step === 2 && 'Xác thực OTP'}
              {step === 3 && 'Đặt lại mật khẩu'}
            </h2>
            <p className="text-sm text-gray-600 text-center font-medium">
              {step === 1 && 'Nhập username để nhận mã OTP'}
              {step === 2 && 'Mã OTP đã được gửi đến email của bạn'}
              {step === 3 && 'Nhập mật khẩu mới của bạn'}
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-2 mt-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-600 text-sm mb-4 text-center bg-red-50 py-2 px-4 rounded-md font-medium border border-red-200">
              {error}
            </p>
          )}

          {/* Step 1: Enter Username */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 text-left mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Nhập username của bạn"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-3 rounded-md font-bold text-white hover:shadow-xl hover:from-blue-700 hover:to-blue-900 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </div>
                ) : (
                  'Gửi mã OTP'
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-blue-700 font-semibold hover:text-blue-900 hover:underline text-sm"
                  disabled={loading}
                >
                  ← Quay lại đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 text-center mb-4">
                  Nhập mã OTP (6 chữ số)
                </label>
                
                {/* OTP Input Fields */}
                <div className="flex justify-center space-x-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => inputRefs.current[index] = el}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={loading}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors disabled:bg-gray-100 disabled:opacity-50"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-3 rounded-md font-bold text-white hover:shadow-xl hover:from-blue-700 hover:to-blue-900 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xác thực...
                  </div>
                ) : (
                  'Xác thực OTP'
                )}
              </button>

              <div className="text-center space-y-2 mt-4">
                <p className="text-sm text-gray-600 font-medium">
                  Chưa nhận được mã?{' '}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || loading}
                    className="text-blue-700 font-bold hover:text-blue-900 hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer"
                  >
                    {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp(['', '', '', '', '', '']);
                  }}
                  className="text-blue-700 font-semibold hover:text-blue-900 hover:underline text-sm cursor-pointer"
                  disabled={loading}
                >
                  ← Thay đổi username
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 text-left mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 pr-12"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                  disabled={loading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 text-left mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 pr-12"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                  disabled={loading}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-3 rounded-md font-bold text-white hover:shadow-xl hover:from-blue-700 hover:to-blue-900 transition disabled:opacity-50 mt-6 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đặt lại...
                  </div>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;