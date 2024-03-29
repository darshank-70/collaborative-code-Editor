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

// const YourComponent = ({ code }) => {
//   const [compiledCode, setCompiledCode] = useState(null);
//   const [error, setError] = useState(null);
//   const [stdErr, setStdErr] = useState(null);

//   const compileCode = async () => {
//     console.log(code);
//     try {
//       const response = await fetch("http://localhost:9000/compile", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "b0e0ee4f-07b8-4206-a631-112e16b75234", // Replace with your Glot.io API token
//         },
//         body: JSON.stringify({
//           files: [
//             {
//               name: "main.js",
//               content: code,
//             },
//           ],
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setCompiledCode(data.stdout);
//         setError(data.error);

//         console.log("OUTPUTTTTTTTT:", data);
//         setStdErr(data.stderr);
//       } else {
//         setError(data.stderr);
//         setStdErr(data.stderr);
//       }
//     } catch (error) {
//       setError("An error occurred while compiling the code.");
//     }
//   };

//   return (
//     <div>
//       <button onClick={compileCode}>Compile</button>
//       {compiledCode} &&{" "}
//       <Output
//         props={{ compiledCode: compiledCode, error: error, stdErr: stdErr }}
//       />
//     </div>
//   );
// };

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
  function handleLangSelect(e) {
    console.log(e.target.value);
    setCurrentLanguage(e.target.value);
    setFilename(fileExt[e.target.value]);
  }
  async function handleCompileClick() {
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
            <select onChange={handleLangSelect} value={currentLanguage}>
              <option value={"javascript"}>javascript</option>
              <option value={"python"}>python</option>
              <option value={"java"}>Java</option>
              <option value={"c"}>C</option>
            </select>
          </div>
          <div className="compile-button">
            <button onClick={handleCompileClick}>compile Code</button>
          </div>
          <div className="stdin-textbox">
            <label>
              {" "}
              Inputs:{" "}
              <input type="text" placeholder="Standard input" id="stdin-text" />
            </label>
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

        {/* <YourComponent code={code} /> */}
        {/* {console.log("working code:  ", code)} */}
      </div>
      {isCompiled && dataRecieved && <Output data={dataRecieved} />}
    </div>
  );
}

export default EditorPage;
