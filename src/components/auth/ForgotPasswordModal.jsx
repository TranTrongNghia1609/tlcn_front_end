import React, { useState, useEffect } from 'react';
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
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  const resetForm = () => {
    setStep(1);
    setUserName('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
    setCountdown(0);
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
    if (!otp.trim()) {
      setError('Vui lòng nhập mã OTP');
      return;
    }

    if (otp.length !== 6) {
      setError('Mã OTP phải có 6 chữ số');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyForgotPasswordOTP(otp.trim());
      toast.success(response.message || 'Xác thực OTP thành công');
      setStep(3);
    } catch (error) {
      setError(error.message || 'Mã OTP không chính xác');
      toast.error(error.message || 'Mã OTP không chính xác');
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
      setOtp(''); // Clear OTP input
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
          <div className="flare-bg w-full h-full" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2 mb-6">
            <h2 className="text-3xl font-extrabold gradient-text-dark">
              {step === 1 && 'Quên mật khẩu'}
              {step === 2 && 'Xác thực OTP'}
              {step === 3 && 'Đặt lại mật khẩu'}
            </h2>
            <p className="text-sm text-gray-600 text-center">
              {step === 1 && 'Nhập username để nhận mã OTP'}
              {step === 2 && `Mã OTP đã được gửi đến email của bạn`}
              {step === 3 && 'Nhập mật khẩu mới của bạn'}
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-2 mt-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-purple-500' : 'bg-gray-300'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <div className={`w-12 h-1 ${step >= 3 ? 'bg-purple-500' : 'bg-gray-300'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-600 text-sm mb-4 text-center bg-red-50 py-2 rounded-md">
              {error}
            </p>
          )}

          {/* Step 1: Enter Username */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 text-left mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập username của bạn"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-purple-600 hover:underline text-sm"
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
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-left mb-2">
                  Mã OTP (6 chữ số)
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  required
                  disabled={loading}
                  maxLength={6}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-800 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
              </button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Chưa nhận được mã?{' '}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || loading}
                    className="text-purple-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                  >
                    {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-purple-600 hover:underline text-sm"
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
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 text-left mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-4.03 9-9 9S3 17 3 12 7.03 3 12 3s9 4.03 9 9z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9-4.03-9-9a8.96 8.96 0 012.125-5.825M6.6 6.6l10.8 10.8M9.88 9.88a3 3 0 004.24 4.24" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-4.03 9-9 9S3 17 3 12 7.03 3 12 3s9 4.03 9 9z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9-4.03-9-9a8.96 8.96 0 012.125-5.825M6.6 6.6l10.8 10.8M9.88 9.88a3 3 0 004.24 4.24" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          )}
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

export default ForgotPasswordModal;