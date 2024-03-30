import React, { StrictMode, useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import Output from "../components/Output";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import compileCode from "../controller/compileCode";

//****************** */

function EditorPage() {
  const socketRef = useRef(null);
  const location = useLocation();
  const codeRef = useRef(null);
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const [code, setCode] = useState(""); // State to hold the code
  const [dataRecieved, setDataRecieved] = useState(null);
  const [isCompiled, setCompiled] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [filename, setFilename] = useState("main.js");
  const [stdin, setStdin] = useState("");

  //theme
  const [selectedTheme, setSelectedTheme] = useState("dracula"); //default

  const fileExt = {
    javascript: "main.js",
    java: "main.java",
    python: "main.py",
    c: "main.c",
  };
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

          /////   if anthing goes wrong, comment thsi //////
          socketRef.current.emit(ACTIONS.JOINED, {
            code: codeRef.current,
            socketId,
          });

          ///// till here //////

          // auto-sync in the  beggining
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

  //// handle copy
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Couldn't copy the Room ID");
      console.log(err);
    }
  }

  //// Leave room

  function handleLeaveRoom() {
    reactNavigator("/");
    toast.success("You left the Room");
  }

  // handle theme

  const handleThemeChange = (e) => setSelectedTheme(e.target.value);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  function handleLangSelect(e) {
    console.log(e.target.value);
    setCurrentLanguage(e.target.value);
    setFilename(fileExt[e.target.value]);
  }

  async function handleCompileClick(e) {
    e.preventDefault();
    // scroll

    // const targetId = e.target.getAttribute('href').slice(1);
    const targetElement = document.getElementById("output-window");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }

    //////
    let textbox = document.querySelector("#stdin-text");
    console.log(textbox.value);
    let dataRecieved = await compileCode(
      code,
      currentLanguage,
      filename,
      textbox.value
    );
    console.log(dataRecieved);
    setDataRecieved(dataRecieved);
    setCompiled(true);
  }

  return (
    <div className="main-wrap">
      <div className="aside">
        <div className="aside-inner">
          <div className="logo">
            <img className="logo-image" src="" alt="logo" />
          </div>
          <div className="language-select">
            <p className="select-lang">Select Language : </p>
            <select
              onChange={handleLangSelect}
              value={currentLanguage}
              className="combo-box"
            >
              <option value={"javascript"}>JavaScript</option>
              <option value={"python"}>Python</option>
              <option value={"java"}>Java</option>
              <option value={"c"}>C</option>
            </select>
          </div>
          <div className="language-select select-theme">
            <p className="select-lang label-theme">Select theme</p>
            <select
              className="combo-box"
              value={selectedTheme}
              onChange={handleThemeChange}
            >
              <option value="dracula">Dracula</option>
              <option value="monokai">Monokai</option>
              <option value="solarized">Solarized Dark</option>
              <option value="material">Material</option>
              <option value="cobalt">Cobalt</option>
              <option value="tomorrow-night-bright">Tomorrow Night</option>
              <option value="base16-light">Base16 Light</option>
              <option value="ayu-dark">Ayu Dark</option>
              <option value="zenburn">Zenburn</option>
              <option value="3024-night">3024 Night</option>
              <option value="material-darker">Material Darker</option>
              <option value="neo">Neo</option>
              <option value="paraiso-dark">Paraiso Dark</option>
              <option value="seti">Seti</option>
              <option value="xq-dark">Xq Dark</option>
            </select>
          </div>

          <div className="stdin-textbox">
            <label className="label-input"> Inputs: </label>
            <input type="text" placeholder="Standard input" id="stdin-text" />
          </div>
          <div className="compile-button">
            <a
              href="#output-window"
              onClick={handleCompileClick}
              className="run-btn"
            >
              Run
            </a>
          </div>
          <h3>Connected</h3>
          <div className="clients-list">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="copy-btn btn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="leave-btn btn" onClick={handleLeaveRoom}>
          Leave
        </button>
      </div>
      <div className="editor-wrap">
        {/* Pass code and setCode as props */}
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          code={code}
          setCode={setCode}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
          selectedTheme={selectedTheme}
          currentLanguage={currentLanguage}
        />

        {/* <YourComponent code={code} /> */}
        {/* {console.log("working code:  ", code)} */}
        {isCompiled && dataRecieved && <Output data={dataRecieved} />}
      </div>
    </div>
  );
}

export default EditorPage;
