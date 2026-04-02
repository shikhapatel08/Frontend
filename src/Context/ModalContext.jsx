import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  // ================================= Hook ================================= //
  const [modals, setModals] = useState([]);

  // ================================= Function ================================= //
  const openModal = (component) => {
    setModals((prev) => [...prev, component]);
  };

  const closeModal = () => {
    setModals((prev) => prev.slice(0, -1)); 
  };

  return (
    // ================================= Context ================================= //
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
