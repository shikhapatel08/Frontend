// import { toast } from "react-toastify";
import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token, userId) => {
  socket = io(import.meta.env.VITE_API_URL, {
    auth: {
      token,
      userId
    },
    transports: ["websocket"],
    autoConnect: true,
    // withCredentials: true
  });

  socket.on("connect", () => {
    console.log("SOCKET CONNECTED:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    // Optionally show toast/error to user
  });

  socket.on("disconnect", () => {
    // toast.error("Session expired, please login again");
    // localStorage.clear();
    // localStorage.removeItem('selectedChat');
    console.log("SOCKET DISCONNECTED");
  });

};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    // localStorage.removeItem('selectedChat');
    socket = null;
  }
};
