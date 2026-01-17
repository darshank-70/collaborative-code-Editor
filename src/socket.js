import { io } from "socket.io-client";

let socketInstance = null;

export const initSocket = () => {
  if (!socketInstance) {

    const options = {
      transports: ["websocket"],
      reconnectionAttempts: Infinity,
      timeout: 20000,
    };
    
    const socketInstance = io(window.location.origin, options);
    
  }
  return socketInstance;
};
