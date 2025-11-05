/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

const FlashContext = createContext();

export const useFlash = () => useContext(FlashContext);

export const FlashProvider = ({ children }) => {
  const [flashMessage, setFlashMessage] = useState(null);

  const showFlash = (message, type = 'success') => {
    setFlashMessage({ message, type });
    setTimeout(() => {
      setFlashMessage(null);
    }, 5000); // Mensagem desaparece após 5 segundos
  };

  const clearFlash = () => {
    setFlashMessage(null);
  };

  return (
    <FlashContext.Provider value={{ flashMessage, showFlash, clearFlash }}>
      {children}
    </FlashContext.Provider>
  );
};
