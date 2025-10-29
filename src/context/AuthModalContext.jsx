import React, { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };
  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };
  

  return (
    <AuthModalContext.Provider value={{
      isLoginOpen,
      isRegisterOpen,
      openLogin,
      openRegister,
      closeModals,
      switchToRegister
    }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);