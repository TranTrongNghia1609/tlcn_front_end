import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const OTPVerificationModal = ({ isOpen, onClose, email, userName, onVerificationSuccess }) => {
  const { verifyRegistrationOTP, resendRegistrationOTP } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto focus first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Vui lòng nhập đầy đủ 6 số OTP');
      return;
    }

    setLoading(true);

    const toastId = toast.loading('Đang xác thực OTP...');

    try {
      
      const response = await verifyRegistrationOTP({
        email: email,
        otp: otpCode
      });
      
      console.log('OTP verification successful:', response);
      
      toast.success('Xác thực thành công! Tài khoản của bạn đã được kích hoạt.', {
        id: toastId,
        duration: 4000
      });
      
      // Reset form
      setOtp(['', '', '', '', '', '']);
      
      // Call success callback
      if (onVerificationSuccess) {
        onVerificationSuccess(response);
      }
      
      // Close modal
      onClose();
      
    } catch (error) {
      const errorMessage = error.message || 'Mã OTP không đúng. Vui lòng thử lại.';
      
      toast.error(errorMessage, {
        id: toastId,
        duration: 4000
      });
      
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setResendLoading(true);

    const toastId = toast.loading('Đang gửi lại mã OTP...');

    try {
      const dataEmailUserName = {
        email: email,
        userName: userName
      }
      await resendRegistrationOTP(dataEmailUserName);
      
      
      toast.success('Mã OTP mới đã được gửi đến email của bạn. Vui lòng kiểm tra!', {
        id: toastId,
        duration: 5000
      });
      
      // Start countdown
      setCountdown(60);
      
      // Clear current OTP
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
    } catch (error) {
      const errorMessage = error.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.';
      
      toast.error(errorMessage, {
        id: toastId,
        duration: 4000
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleClose = () => {
    setOtp(['', '', '', '', '', '']);
    setCountdown(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="relative bg-white/90 backdrop-blur-md border border-white/30 shadow-xl rounded-xl sm:rounded-2xl w-full max-w-md mx-auto px-6 py-8">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="flare-bg w-full h-full" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Xác thực Email
            </h2>
            <p className="text-sm text-gray-600">
              Chúng tôi đã gửi mã xác thực 6 số đến
            </p>
            <p className="text-sm font-medium text-blue-600 break-all">
              {email}
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit}>
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
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:opacity-50"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </form>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Không nhận được mã?
            </p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={countdown > 0 || resendLoading}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi lại...
                </span>
              ) : countdown > 0 ? (
                `Gửi lại sau ${countdown}s`
              ) : (
                'Gửi lại mã OTP'
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Kiểm tra thư mục spam nếu không thấy email
            </p>
          </div>
        </div>

        <style>
          {`
            .flare-bg {
              background: radial-gradient(40% 40% at 50% 50%, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.2) 40%, transparent 80%);
              filter: blur(60px);
            }
          `}
        </style>
      </div>
    </Modal>
  );
};

export default OTPVerificationModal;