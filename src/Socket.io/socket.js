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
  });

  socket.on("connect", () => {
    console.log("SOCKET CONNECTED:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("disconnect", () => {
    console.log("SOCKET DISCONNECTED");
  });

};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
