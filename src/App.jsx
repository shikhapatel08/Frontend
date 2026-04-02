import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import { ModalProvider } from './Context/ModalContext';
import { ThemeProvider } from './Context/ThemeContext';
import { SocketProvider } from './Context/SocketContext';

import { getToken } from "firebase/messaging";
import { useDispatch } from 'react-redux';
import { getFcmToken } from './Redux/Features/FcmSlice';
import { initMessaging } from './firebaseConfig';
import ImagePreviewModal from './Components/ChatListComponents/ImagePreviewModal';

function App() {

  const dispatch = useDispatch();
  const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

  async function requestPermission(messaging) {
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: `${VAPID_KEY}`
        });


        if (token) {
          dispatch(getFcmToken(token));
        }
      } else {
        console.log("Permission denied");
      }
    } catch (error) {
      console.error("FCM Error:", error);
    }
  }

  async function setupFCM() {
    const messaging = await initMessaging();

    if (!messaging) return;

    requestPermission(messaging);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (typeof Notification === "undefined") return;
    setupFCM();
  }, []);

  return (
    <>
      <Router>
        <SocketProvider>
          <ThemeProvider>
            <ModalProvider>
              <ToastContainer position='top-right' />
              <AppRoutes />
              <ImagePreviewModal />
            </ModalProvider>
          </ThemeProvider>
        </SocketProvider>
      </Router>
    </>
  );
}

export default App;
