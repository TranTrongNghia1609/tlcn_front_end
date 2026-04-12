import React, { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); 
  
  const [modalOptions, setModalOptions] = useState({
    prefillEmail: '',
    onSuccess: null,
    pendingAction: null, 
    redirectPath: null 
  });

  const getCurrentPath = () => {
    return window.location.pathname + window.location.search + window.location.hash;
  };

  const openLogin = (options = {}) => {
    setModalOptions({
      prefillEmail: options.prefillEmail || '',
      onSuccess: options.onSuccess || null,
      pendingAction: options.pendingAction || null,
      redirectPath: options.redirectPath !== undefined 
        ? options.redirectPath 
        : getCurrentPath()
    });
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
  };

  const openRegister = (options = {}) => {
    setModalOptions({
      prefillEmail: options.prefillEmail || '',
      onSuccess: options.onSuccess || null,
      pendingAction: options.pendingAction || null,
      redirectPath: options.redirectPath !== undefined 
        ? options.redirectPath 
        : getCurrentPath()
    });
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(false);
  };

  const openForgotPassword = (options = {}) => { 
    setModalOptions({
      ...modalOptions,
      ...options,
      redirectPath: options.redirectPath !== undefined 
        ? options.redirectPath 
        : (modalOptions.redirectPath || getCurrentPath())
    });
    setIsForgotPasswordOpen(true);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  // Generic openModal function
  const openModal = (type, options = {}) => {
    if (type === 'login') {
      openLogin(options);
    } else if (type === 'register') {
      openRegister(options);
    } else if (type === 'forgotPassword') {
      openForgotPassword(options);
    }
  };

  const switchToRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(false);
  };

  const switchToLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
  };

  const switchToForgotPassword = () => {
    setIsForgotPasswordOpen(true);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
   
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
        pendingAction: null,
        redirectPath: null
      });
    }, 300); 
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