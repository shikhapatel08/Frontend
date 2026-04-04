import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openModal = (component) => {
    setModals((prev) => [...prev, component]);
  };

  const closeModal = () => {
    setModals((prev) => prev.slice(0, -1));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {modals.map((ModalComponent, index) => (
        <div key={index} style={{ zIndex: 1000 + index }}>
          {ModalComponent}
        </div>
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
