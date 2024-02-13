import React, { useState } from "react";
import Client from "../components/Client";

import Editor from "../components/Editor";
const EditorPage = () => {
  const [clients, setClients] = useState([
    { socketId: 1, username: "Jeevan Kumar" },
    { socketId: 2, username: "Darshan K" },
  ]);
  return (
    <div className="main-wrap">
      <div className="aside">
        <div className="aside-inner">
          <div className="logo">
            <img className="logo-image" src="" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clients-list">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copy-btn">Copy ROOM ID</button>
        <button className="btn leave-btn">Leave</button>
      </div>
      <div className="editor-wrap">
        <Editor />
      </div>
    </div>
  );
};
export default EditorPage;
