import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUserName] = useState("");

  const navigate = useNavigate();

  function onCreateRoom(e) {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
  }

  function joinRoom() {
    if (!roomId || !username) {
      toast.error("ROOM ID and USERNAME required!");
      return;
    }

    // REDIRECT
    toast.success("Room created successfully!");

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  }

  function handleInputEnter(e) {
    if (e.code === "Enter") {
      joinRoom();
    }
  }

  return (
    <div className="home">
      <div className="form-wrapper">
        <img src="/logo192.png" alt="app-logo" className="logo-img" />
        <h4 className="main-label">Enter invitation ROOM ID</h4>
        <div className="input-group">
          <input
            type="text"
            className="input-box"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="input-box"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <button className="btn join-btn" onClick={joinRoom}>
            Join
          </button>
          <span className="create-info">
            If you don't have invitation, create room{" "}
            <a href="#" className="create-room-btn" onClick={onCreateRoom}>
              new room
            </a>
          </span>
        </div>
      </div>
      {/* <footer>FOOTER</footer> */}
    </div>
  );
}
