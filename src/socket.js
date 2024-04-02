import { io } from "socket.io-client";

let socketInstance = null;

export const initSocket = () => {
  if (!socketInstance) {
    const options = {
      reconnectionAttempts: Infinity,
      timeout: 10000,
      transports: ["websocket"],
    };

    socketInstance = io(process.env.REACT_APP_BACKEND_URL, options);
  }

  return socketInstance;
};
