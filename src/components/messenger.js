import { useState, useEffect } from "react";
import Avatar from "react-avatar";

function Messeneger({ socketRef, isOpen, setIsOpen, username }) {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    if (socketRef.current) {
      socketRef.current.on("message", handleNewMessage);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message", handleNewMessage);
      }
    };
  }, [socketRef.current]);

  const handleSendMessage = () => {
    if (userMessage.trim() !== "") {
      socketRef.current.emit("user-message", {
        message: userMessage,
        username,
      });
      setUserMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };
  // console.log(socketRef);
  return (
    <div className="modal-container">
      <div className={`modal ${isOpen ? "active" : ""}`}>
        <div>
          <div className="chat-and-close">
            <p className="messenger-header">CHAT BOX</p>
            <button className="close" onClick={() => setIsOpen(false)}>
              X
            </button>
          </div>
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className="individual-message">
                <p className="label-username">{message.username}</p>
                <p className="label-message sent-by-me">{message.message}</p>
                <hr />
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              placeholder="Type message"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="send" onClick={handleSendMessage}>
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messeneger;
