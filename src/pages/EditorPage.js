import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const YourComponent = ({ code }) => {
  const [compiledCode, setCompiledCode] = useState("");
  const [error, setError] = useState(null);
  const [stdErr, setStdErr] = useState(null);

  const compileCode = async () => {
    console.log(code);
    try {
      const response = await fetch("http://localhost:9000/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "b0e0ee4f-07b8-4206-a631-112e16b75234", // Replace with your Glot.io API token
        },
        body: JSON.stringify({
          files: [
            {
              name: "main.js",
              content: code,
            },
          ],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCompiledCode(data.stdout);
        setError(data.error);

        console.log("OUTPUTTTTTTTT:", data);
        setStdErr(data.stderr);
      } else {
        setError(data.stderr);
        setStdErr(data.stderr);
      }
    } catch (error) {
      setError("An error occurred while compiling the code.");
    }
  };

  return (
    <div>
      <button onClick={compileCode}>Compile</button>
      {compiledCode && <pre>{compiledCode}</pre>}
      {error && <div>{error}</div>}
      {error && `${error} ${stdErr}`}
    </div>
  );
};

function EditorPage() {
  const socketRef = useRef(null);
  const location = useLocation();
  const codeRef = useRef(null);
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const [code, setCode] = useState(""); // State to hold the code

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // listening for joined
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      //listen for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    init();
    return () => {
      if (socketRef.current !== null) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

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
        {/* Pass code and setCode as props */}
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          code={code}
          setCode={setCode}
        />
        <h2>Code Compiler</h2>
        <YourComponent code={code} />
        {console.log("working code:  ", code)}
      </div>
    </div>
  );
}

export default EditorPage;
