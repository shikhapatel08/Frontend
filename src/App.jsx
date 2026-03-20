import { BrowserRouter as Router, Routes } from 'react-router-dom';
import AppRoutes from './Routes/AppRoutes';
import { ToastContainer } from 'react-toastify'
import { ModalProvider } from './Context/ModalContext';
import { useEffect } from 'react';
import { initSocket } from './Socket.io/socket';
import { useSelector } from 'react-redux';
import { ThemeProvider } from './Context/ThemeContext';
import { SocketProvider } from './Context/SocketContext';


function App() {

  return (
    <>
      <Router>
        <SocketProvider>
          <ThemeProvider>
            <ModalProvider>
              <ToastContainer position='top-right' />
              <AppRoutes />
            </ModalProvider>
          </ThemeProvider>
        </SocketProvider>
      </Router>
    </>
  )
}

export default App
