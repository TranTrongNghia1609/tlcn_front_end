import React, { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); 
  // Modal options (prefillEmail, onSuccess callback, etc.)
  const [modalOptions, setModalOptions] = useState({
    prefillEmail: '',
    onSuccess: null,
    pendingAction: null // { type: 'joinClassroom', data: { classCode, token } }
  });

  const openLogin = (options = {}) => {
    setModalOptions({
      prefillEmail: options.prefillEmail || '',
      onSuccess: options.onSuccess || null,
      pendingAction: options.pendingAction || null
    });
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const openRegister = (options = {}) => {
    setModalOptions({
      prefillEmail: options.prefillEmail || '',
      onSuccess: options.onSuccess || null,
      pendingAction: options.pendingAction || null
    });
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };
  const openForgotPassword = (options = {}) => { 
    closeModals();
    setModalOptions(options);
    setIsForgotPasswordOpen(true);
  };

  // Generic openModal function
  const openModal = (type, options = {}) => {
    if (type === 'login') {
      openLogin(options);
    } else if (type === 'register') {
      openRegister(options);
    }
  };

  const switchToRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
    // Keep existing options when switching
  };

  const switchToLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
    // Keep existing options when switching
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
    // Clear options after closing
    setTimeout(() => {
      setModalOptions({
        prefillEmail: '',
        onSuccess: null,
        pendingAction: null
      });
    }, 300); // Delay to allow modal close animation
  };
  const switchToForgotPassword = () => { // ← ADDED
    closeModals();
    openForgotPassword(modalOptions);
  };

  return (
    <AuthModalContext.Provider value={{
      isLoginOpen,
      isRegisterOpen,
      isForgotPasswordOpen,
      modalOptions,
      openLogin,
      openRegister,
      openForgotPassword,
      openModal,
      closeModals,
      switchToRegister,
      switchToLogin,
      switchToForgotPassword
    }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);